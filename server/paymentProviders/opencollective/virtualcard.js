import moment from 'moment';
import uuidv4 from 'uuid/v4';
import { get, times } from 'lodash';
import models, { Op, sequelize } from '../../models';
import * as libpayments from '../../lib/payments';
import * as currency from '../../lib/currency';
import { formatCurrency, isValidEmail } from '../../lib/utils';

/**
 * Virtual Card Payment method - This payment Method works basically as an alias
 * to other Payment method(field "SourcePaymentMethodId") that will create transactions
 * and then the payment methods of those transactions will be replaced by
 * the virtual card payment method that first processed the order.
 */

/** Get the balance of a virtual card card
 * @param {models.PaymentMethod} paymentMethod is the instance of the
 *  virtual card payment method.
 * @return {Object} with amount & currency from the payment method.
 */
async function getBalance(paymentMethod) {
  if (!libpayments.isProvider('opencollective.virtualcard', paymentMethod)) {
    throw new Error(`Expected opencollective.virtualcard but got ${paymentMethod.service}.${paymentMethod.type}`);
  }
  let query = {
    PaymentMethodId: paymentMethod.id,
    type: 'DEBIT',
  };
  let initialBalance = paymentMethod.initialBalance;
  if (paymentMethod.monthlyLimitPerMember) {
    // consider initial balance as monthly limit
    initialBalance = paymentMethod.monthlyLimitPerMember;
    // find first and last days of current month(first and last ms of those days)
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    // update query to filter result through the dates
    query = { ...query, createdAt: { [Op.between]: [firstDay, lastDay] } };
  }
  /* Result will be negative (We're looking for DEBIT transactions) */
  const allTransactions = await models.Transaction.findAll({
    attributes: ['netAmountInCollectiveCurrency', 'currency'],
    where: query,
  });
  let spent = 0;
  for (const transaction of allTransactions) {
    if (transaction.currency != paymentMethod.currency) {
      const fxRate = await currency.getFxRate(transaction.currency, paymentMethod.currency);
      spent += transaction.netAmountInCollectiveCurrency * fxRate;
    } else {
      spent += transaction.netAmountInCollectiveCurrency;
    }
  }
  const balance = {
    amount: Math.round(initialBalance + spent),
    currency: paymentMethod.currency,
  };
  return balance;
}

/** Process a virtual card order
 *
 * @param {models.Order} order The order instance to be processed.
 * @return {models.Transaction} the double entry generated transactions.
 */
async function processOrder(order) {
  const paymentMethod = await models.PaymentMethod.findById(order.paymentMethod.id);
  // check if payment Method has expired
  if (!paymentMethod.expiryDate || moment(paymentMethod.expiryDate) < moment()) {
    throw new Error('Payment method has already expired');
  }

  // Checking if balance is ok or will still be after completing the order
  const balance = await getBalance(paymentMethod);
  if (!balance || balance.amount <= 0) {
    throw new Error('This payment method has no balance to complete this order');
  }
  // converting(or keeping if it's the same currency) order amount to the payment method currency
  let orderAmountInPaymentMethodCurrency = order.totalAmount;
  if (order.currency != paymentMethod.currency) {
    const fxRate = await currency.getFxRate(order.currency, paymentMethod.currency);
    orderAmountInPaymentMethodCurrency = order.totalAmount * fxRate;
  }
  if (balance.amount - orderAmountInPaymentMethodCurrency < 0) {
    throw new Error(`Order amount exceeds balance(${balance.amount} ${paymentMethod.currency})`);
  }

  // Making sure the SourcePaymentMethodId is Set(requirement for virtual cards)
  if (!get(paymentMethod, 'SourcePaymentMethodId')) {
    throw new Error('Gift Card payment method must have a value a "SourcePaymentMethodId" defined');
  }
  // finding Source Payment method and update order payment method properties
  const sourcePaymentMethod = await models.PaymentMethod.findById(paymentMethod.SourcePaymentMethodId);
  // modifying original order to then process the order of the source payment method
  order.PaymentMethodId = sourcePaymentMethod.id;
  order.paymentMethod = sourcePaymentMethod;
  // finding the payment provider lib to execute the order
  const sourcePaymentMethodProvider = libpayments.findPaymentMethodProvider(sourcePaymentMethod);

  // gets the Credit transaction generated
  let creditTransaction = await sourcePaymentMethodProvider.processOrder(order);
  // undo modification of original order after processing the source payment method order
  order.PaymentMethodId = paymentMethod.id;
  order.paymentMethod = paymentMethod;
  // gets the Debit transaction generated through the TransactionGroup field.
  const updatedTransactions = await models.Transaction.update(
    {
      PaymentMethodId: paymentMethod.id,
      UsingVirtualCardFromCollectiveId: sourcePaymentMethod.CollectiveId,
    },
    {
      where: { TransactionGroup: creditTransaction.TransactionGroup },
      returning: true,
    },
  );
  // updating creditTransaction with latest data
  creditTransaction = updatedTransactions[1].filter(t => t.type === 'CREDIT')[0];
  return creditTransaction;
}

/** Create Virtual payment method for a collective(organization or user)
 *
 * @param {Object} args contains the parameters to create the new
 *  payment method.
 * @param {Number} args.CollectiveId The ID of the organization creating the virtual card.
 * @param {String} args.currency The currency of the card to be created.
 * @param {Number} [args.amount] The total amount that will be
 *  credited to the newly created payment method.
 * @param {Number} [args.monthlyLimitPerMember] Limit for the value of
 *  the card that can be used per month in cents.
 * @param {String} [args.description] The description of the new payment
 *  method.
 * @param {Number} [args.PaymentMethodId] The ID of the Source Payment method the
 *                 organization wants to use
 * @param {Date} [args.expiryDate] The expiry date of the payment method
 * @param {[limitedToTags]} [args.limitedToTags] Limit this payment method to donate to collectives having those tags
 * @param {[limitedToCollectiveIds]} [args.limitedToCollectiveIds] Limit this payment method to those collective ids
 * @param {[limitedToHostCollectiveIds]} [args.limitedToHostCollectiveIds] Limit this payment method to collectives hosted by those collective ids
 * @param {boolean} sendEmailAsync if true, emails will be sent in background
 *  and we won't check if it has properly been sent to confirm
 * @returns {models.PaymentMethod + code} return the virtual card payment method with
            an extra property "code" that is basically the last 8 digits of the UUID
 */
async function create(args, remoteUser) {
  const collective = await models.Collective.findById(args.CollectiveId);
  const sourcePaymentMethod = await getSourcePaymentMethodFromCreateArgs(args, collective);
  const createParams = getCreateParams(args, collective, sourcePaymentMethod, remoteUser);
  const virtualCard = await models.PaymentMethod.create(createParams);
  // TODO send email
  return virtualCard;
}

/**
 * Bulk create virtual cards from a `count`. Doesn't send emails, please use
 * `createForEmails` if you need to.
 *
 * @param {object} args
 * @param {object} remoteUser
 * @param {integer} count
 */
export async function bulkCreateVirtualCards(args, remoteUser, count) {
  if (count > 100) {
    throw new Error('Cannot create more than 100 virtual cards in one pass.');
  } else if (!count) {
    return [];
  }

  const collective = await models.Collective.findById(args.CollectiveId);
  const sourcePaymentMethod = await getSourcePaymentMethodFromCreateArgs(args, collective);
  const virtualCardsParams = times(count, () => getCreateParams(args, collective, sourcePaymentMethod, remoteUser));
  return await models.PaymentMethod.bulkCreate(virtualCardsParams);
}

/**
 * Bulk create virtual cards from a list of emails.
 *
 * @param {object} args
 * @param {object} remoteUser
 * @param {integer} count
 */
export async function createVirtualCardsForEmails(args, remoteUser, emails) {
  if (emails.length > 100) {
    throw new Error('Cannot create more than 100 virtual cards in one pass.');
  } else if (emails.length === 0) {
    return [];
  }

  const collective = await models.Collective.findById(args.CollectiveId);
  const sourcePaymentMethod = await getSourcePaymentMethodFromCreateArgs(args, collective);
  const virtualCardsParams = emails.map(email =>
    getCreateParams({ ...args, data: { email } }, collective, sourcePaymentMethod, remoteUser),
  );
  const virtualCards = models.PaymentMethod.bulkCreate(virtualCardsParams);
  // TODO send emails
  return virtualCards;
}

/**
 * Get a payment method from args or returns collective default payment method
 * if none has been provided. Will throw if collective doesn't have any payment
 * method attached.
 *
 * @param {object} args
 * @param {object} remoteUser
 */
async function getSourcePaymentMethodFromCreateArgs(args, collective) {
  let paymentMethod = null;
  if (!args.PaymentMethodId) {
    paymentMethod = await collective.getPaymentMethod({ service: 'stripe', type: 'creditcard' }, false);
    if (!paymentMethod) {
      throw Error(`Collective id ${collective.id} needs to have a Credit Card attached to create Gift Cards.`);
    }
  } else {
    paymentMethod = await models.PaymentMethod.findById(args.PaymentMethodId);
    if (!paymentMethod || paymentMethod.CollectiveId !== collective.id) {
      throw Error('Invalid PaymentMethodId');
    }
  }
  return paymentMethod;
}

/**
 * Get a PaymentMethod object representing the VirtualCard to be created. Will
 * throw if given invalid args.
 *
 * @param {object} args
 * @param {object} remoteUser
 * @param {object} collective
 * @param {object} sourcePaymentMethod
 */
function getCreateParams(args, collective, sourcePaymentMethod, remoteUser) {
  // Make sure user is admin of collective
  if (!remoteUser.isAdmin(collective.id)) {
    throw new Error('User must be admin of collective');
  }

  // Make sure currency is a string, trim and uppercase it.
  args.currency = args.currency ? args.currency.toString().toUpperCase() : collective.currency;
  if (!['USD', 'EUR'].includes(args.currency)) {
    throw new Error(`Currency ${args.currency} not supported. We only support USD and EUR at the moment.`);
  }

  // Ensure amount or monthlyLimitPerMember are valid
  if (!args.amount && !args.monthlyLimitPerMember) {
    throw Error('you need to define either the amount or the monthlyLimitPerMember of the payment method.');
  } else if (args.amount && args.amount < 5) {
    throw Error('Min amount for gift card is $5');
  } else if (args.monthlyLimitPerMember && args.monthlyLimitPerMember < 5) {
    throw Error('Min monthly limit per member for gift card is $5');
  }

  // Set a default expirity date to 3 months by default
  const expiryDate = args.expiryDate
    ? moment(args.expiryDate).format()
    : moment()
        .add(3, 'months')
        .format();

  // If monthlyLimitPerMember is defined, we ignore the amount field and
  // consider monthlyLimitPerMember times the months from now until the expiry date
  let monthlyLimitPerMember;
  let amount = args.amount;
  let description = `${formatCurrency(amount, args.currency)} Gift Card from ${collective.name}`;
  if (args.monthlyLimitPerMember) {
    monthlyLimitPerMember = args.monthlyLimitPerMember;
    amount = null;
    description = `${formatCurrency(args.monthlyLimitPerMember, args.currency)} Monthly Gift Card from ${
      collective.name
    }`;
  }

  // Whitelist fields for `data`
  let data = null;
  if (args.data && args.data.email) {
    if (!isValidEmail(args.data.email)) {
      throw new Error(`Invalid email address: ${args.data.email}`);
    }
    data = { email: args.data.email };
  }

  // Build the virtualcard object
  return {
    CreatedByUserId: remoteUser.id,
    SourcePaymentMethodId: sourcePaymentMethod.id,
    name: description,
    description: args.description || description,
    initialBalance: amount,
    monthlyLimitPerMember: monthlyLimitPerMember,
    currency: args.currency,
    CollectiveId: args.CollectiveId,
    expiryDate: expiryDate,
    limitedToTags: args.limitedToTags,
    limitedToCollectiveIds: args.limitedToCollectiveIds,
    limitedToHostCollectiveIds: args.limitedToHostCollectiveIds,
    uuid: uuidv4(),
    service: 'opencollective',
    type: 'virtualcard',
    createdAt: new Date(),
    updatedAt: new Date(),
    data,
  };
}

/** Claim the Virtual Card Payment Method By an (existing or not) user
 * @param {Object} args contains the parameters
 * @param {String} args.code The 8 last digits of the UUID
 * @param {email} args.user.email The email of the user claiming the virtual card
 * @returns {models.PaymentMethod} return the virtual card payment method.
 */
async function claim(args, remoteUser) {
  // Validate code format
  const redeemCodeRegex = /^[a-zA-Z0-9]{8}$/;
  if (!redeemCodeRegex.test(args.code)) {
    throw Error(`Gift Card code "${args.code}" has invalid format`);
  }

  // Get code from DB
  const virtualCardPaymentMethod = await models.PaymentMethod.findOne({
    where: sequelize.and(
      sequelize.where(sequelize.cast(sequelize.col('uuid'), 'text'), {
        [Op.like]: `${args.code}%`,
      }),
      { service: 'opencollective' },
      { type: 'virtualcard' },
    ),
  });
  if (!virtualCardPaymentMethod) {
    throw Error(`Gift Card code "${args.code}" is invalid`);
  }
  const sourcePaymentMethod = await models.PaymentMethod.findById(virtualCardPaymentMethod.SourcePaymentMethodId);
  // if the virtual card PM Collective Id is different than the Source PM Collective Id
  // it means this virtual card was already claimend
  if (!sourcePaymentMethod || sourcePaymentMethod.CollectiveId !== virtualCardPaymentMethod.CollectiveId) {
    throw Error('Gift Card already redeemed');
  }
  // find or creating a user with its collective
  // if user is created, this will NOT send a registration email
  const user = remoteUser || (await models.User.findOrCreateByEmail(get(args, 'user.email'), args.user));
  if (!user) {
    throw Error('Please provide user details or make this request as a logged in user.');
  }
  // updating virtual card with collective Id of the user
  await virtualCardPaymentMethod.update({
    CollectiveId: user.CollectiveId,
    confirmedAt: new Date(),
  });
  virtualCardPaymentMethod.sourcePaymentMethod = sourcePaymentMethod;
  return virtualCardPaymentMethod;
}

/* Expected API of a Payment Method Type */
export default {
  features: {
    recurring: true,
    waitToCharge: false,
  },
  getBalance,
  processOrder,
  create,
  claim,
};
