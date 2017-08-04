import models from '../models';
import paymentsLib from '../lib/payments';
import emailLib from '../lib/email';
import Promise from 'bluebird';
import { difference } from 'lodash';
import { hasRole } from '../lib/auth';
import errors from '../lib/errors';
import { pluralize } from '../lib/utils';

import roles from '../constants/roles';

import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import {
  OrderType,
  TierType,
  MemberType
} from './types';

import {
  CollectiveInterfaceType
} from './CollectiveInterface';

import {
  CollectiveInputType,
  CollectiveAttributesInputType,
  OrderInputType,
  TierInputType,
  UserAttributesInputType
} from './inputTypes';

// import { hasRole } from '../middleware/security/auth';
// import {HOST, ADMIN} from '../constants/roles';

const mutations = {
  createCollective: {
    type: CollectiveInterfaceType,
    args: {
      collective: { type: new GraphQLNonNull(CollectiveInputType) }
    },
    resolve(_, args, req) {
 
      if (!req.remoteUser) {
        return Promise.reject(new errors.Unauthorized("You need to be logged in to create a collective"));
      }

      let parentCollective;

      const location = args.collective.location;

      const collectiveData = {
        ...args.collective,
        locationName: location.name,
        address: location.address,
        CreatedByUserId: req.remoteUser.id
      };

      if (location && location.lat) {
        collectiveData.geoLocationLatLong = { type: 'Point', coordinates: [location.lat, location.long] };
      }

      return models.Collective.findById(args.collective.ParentCollectiveId)
      .then(pc => {
        if (!pc) return Promise.reject(new Error(`Parent collective with id ${args.collective.ParentCollectiveId} not found`));
        parentCollective = pc;
        collectiveData.ParentCollectiveId = parentCollective.id;

        // To ensure uniqueness of the slug, if the type of collective is not COLLECTIVE (e.g. EVENT)
        // we force the slug to be of the form of ":parentCollectiveSlug/events/:eventSlug"
        if (collectiveData.type !== 'COLLECTIVE') {
          collectiveData.slug = `${parentCollective.slug}/${collectiveData.type.toLowerCase()}s/${args.collective.slug.replace(/.*\//,'')}`;
          return hasRole(req.remoteUser.id, parentCollective.id, ['ADMIN', 'HOST', 'BACKER'])
        } else {
          return hasRole(req.remoteUser.id, collectiveData.id, ['ADMIN', 'HOST'])
        }
      })
      .then(canCreateEvent => {
        if (!canCreateEvent) return Promise.reject(new errors.Unauthorized(`You must be logged in as a member of the ${parentCollective.slug} collective to create an event`));
      })
      .then(() => models.Collective.create(collectiveData))
      .tap(collective => {
        if (args.collective.tiers) {
          args.collective.tiers.map
          return Promise.map(args.collective.tiers, (tier) => {
            tier.CollectiveId = collective.id;
            tier.currency = tier.currency || collective.currency;
            return models.Tier.create(tier);
          })
        }
      })
      .catch(e => {
        let msg;
        switch (e.name) {
          case "SequelizeUniqueConstraintError":
            msg = `The slug ${e.fields.slug} is already taken. Please use another one.`
            break;
          default:
            msg = e.message;
            break;
        }
        throw new Error(msg);
      })
    }
  },
  editCollective: {
    type: CollectiveInterfaceType,
    args: {
      collective: { type: CollectiveInputType }
    },
    resolve(_, args, req) {

      if (!req.remoteUser) {
        throw new errors.Unauthorized("You need to be logged in to edit a collective");
      }

      const location = args.collective.location;

      const updatedCollectiveData = {
        ...args.collective,
        locationName: location.name,
        address: location.address,
        LastEditedByUserId: req.remoteUser.id
      };

      if (location.lat) {
        updatedCollectiveData.geoLocationLatLong = {type: 'Point', coordinates: [location.lat, location.long]};
      }

      let collective, parentCollective;
      return models.Collective.findById(args.collective.ParentCollectiveId)
      .then(pc => {
        if (!pc) return Promise.reject(new Error(`Parent collective with id ${args.collective.ParentCollectiveId} not found`));
        parentCollective = pc;
        updatedCollectiveData.ParentCollectiveId = parentCollective.id;

        // To ensure uniqueness of the slug, if the type of collective is not COLLECTIVE (e.g. EVENT)
        // we force the slug to be of the form of ":parentCollectiveSlug/events/:eventSlug"
        if (updatedCollectiveData.type !== 'COLLECTIVE') {
          updatedCollectiveData.slug = `${parentCollective.slug}/${updatedCollectiveData.type.toLowerCase()}s/${updatedCollectiveData.slug.replace(/.*\//,'')}`;
          return hasRole(req.remoteUser.id, parentCollective.id, ['ADMIN', 'HOST', 'BACKER'])
        } else {
          return hasRole(req.remoteUser.id, updatedCollectiveData.id, ['ADMIN', 'HOST'])
        }
      })
      .then(canEditCollective => {
        if (!canEditCollective) return Promise.reject(new errors.Unauthorized(`You must be logged in as an admin of the ${updatedCollectiveData.type === 'COLLECTIVE' ? updatedCollectiveData.slug : parentCollective.slug} collective to edit this ${updatedCollectiveData.type.toLowerCase()} collective`));
      })
      .then(() => models.Collective.findById(args.collective.id))
      .then(c => {
        if (!c) throw new Error(`Collective with id ${args.collective.id} not found`);
        collective = c;
        return collective;
      })
      .then(collective => collective.update(updatedCollectiveData))
      .then(collective => collective.getTiers())
      .then(tiers => {
        if (args.collective.tiers) {
          // remove the tiers that are not present anymore in the updated collective
          const diff = difference(tiers.map(t => t.id), args.collective.tiers.map(t => t.id));
          return models.Tier.update({ deletedAt: new Date }, { where: { id: { $in: diff }}})
        }
      })
      .then(() => {
        if (args.collective.tiers) {
          return Promise.map(args.collective.tiers, (tier) => {
            if (tier.id) {
              return models.Tier.update(tier, { where: { id: tier.id }});
            } else {
              tier.CollectiveId = collective.id;
              tier.currency = tier.currency || collective.currency;
              return models.Tier.create(tier);  
            }
          });
        }
      })
      .then(() => collective);
    }
  },
  deleteCollective: {
    type: CollectiveInterfaceType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt)}
    },
    resolve(_, args, req) {

      if (!req.remoteUser) {
        throw new errors.Unauthorized("You need to be logged in to delete a collective");
      }

      return models.Collective
        .findById(args.id)
        .then(collective => {
          if (!collective) throw new errors.NotFound(`Collective with id ${args.id} not found`);
          return collective
            .canEdit(req.remoteUser)
            .then(canEditCollective => {
              if (!canEditCollective) throw new errors.Unauthorized("You need to be logged in as a core contributor or as a host to edit this collective");
              return collective.destroy();
            });
        });
    }
  },
  editTiers: {
    type: new GraphQLList(TierType),
    args: {
      collectiveSlug: { type: new GraphQLNonNull(GraphQLString) },
      tiers: { type: new GraphQLList(TierInputType) }
    },
    resolve(_, args, req) {

      let collective;
      if (!req.remoteUser) {
        throw new errors.Unauthorized("You need to be logged in to edit tiers");
      }
      return models.Collective.findOne({ where: { slug: args.collectiveSlug } })
      .then(c => {
        if (!c) throw new Error(`Collective with slug ${args.collectiveSlug} not found`);
        collective = c;
        return hasRole(req.remoteUser.id, collective.id, ['ADMIN','HOST'])
      })
      .then(canEdit => {
        if (!canEdit) throw new errors.Unauthorized(`You need to be logged in as a core contributor or as a host of the ${args.collectiveSlug} collective`);
      })
      .then(() => collective.getTiers())
      .then(tiers => {
        // remove the tiers that are not present anymore in the updated collective
        const diff = difference(tiers.map(t => t.id), args.tiers.map(t => t.id));
        return models.Tier.update({ deletedAt: new Date }, { where: { id: { $in: diff }}})
      })
      .then(() => {
        return Promise.map(args.tiers, (tier) => {
          if (tier.id) {
            return models.Tier.update(tier, { where: { id: tier.id }});
          } else {
            tier.CollectiveId = collective.id;
            tier.currency = tier.currency || collective.currency;
            return models.Tier.create(tier);
          }
        });
      })
      .then(() => collective.getTiers());
    }
  },
  createMember: {
    type: MemberType,
    args: {
      user: { type: UserAttributesInputType },
      collective: { type: CollectiveAttributesInputType },
      role: { type: GraphQLString }
    },
    resolve(_, args, req) {
      let collective;

      const checkPermission = () => {
        if (!req.remoteUser) {
          throw new errors.Unauthorized("You need to be logged in to create a member");
        }
        return hasRole(req.remoteUser.id, collective.id, ['ADMIN','HOST'])
          .then(canEdit => {
            if (!canEdit) throw new errors.Unauthorized(`You need to be logged in as a core contributor or as a host of the ${args.collective.slug} collective`);
          })
      }

      return models.Collective.findBySlug(args.collective.slug)
      .then(c => {
        if (!c) throw new Error(`Collective with slug ${args.collective.slug} not found`);
        collective = c;
      })
      .then(() => {
        if (args.role !== roles.FOLLOWER) {
          return checkPermission();
        } else {
          return null;
        }
      })
      // find or create user
      .then(() => {
        if (args.user.id) {
          return args.user;
        } else {
          return models.User.findOne({
            where: {
              $or: {
                email: args.user.email,
                paypalEmail: args.user.email
              }
            }
          })
        }
      })
      .then(u => u || models.User.createUserWithCollective(args.user))
      // add user as member of the collective
      .then((user) => models.Member.create({
        CreatedByUserId: user.id,
        MemberCollectiveId: user.CollectiveId,
        CollectiveId: collective.id,
        role: args.role.toUpperCase() || roles.FOLLOWER
      }));
    }
  },
  removeMember: {
    type: MemberType,
    args: {
      user: { type: new GraphQLNonNull(UserAttributesInputType) },
      collective: { type: new GraphQLNonNull(CollectiveAttributesInputType) },
      role: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(_, args, req) {
      let collective;

      const checkPermission = () => {
        if (!req.remoteUser) {
          throw new errors.Unauthorized("You need to be logged in to remove a member");
        }
        if (req.remoteUser.id === args.user.id) {
          return Promise.resolve(true);
        }
        return hasRole(req.remoteUser.id, collective.id, ['ADMIN', 'HOST'])
          .then(canEdit => {
            if (!canEdit) throw new errors.Unauthorized(`You need to be logged in as this user or as a core contributor or as a host of the ${args.collective.slug} collective`);
          })
      }

      return models.Collective.findBySlug(args.collective.slug)
      .then(c => {
        if (!c) throw new Error(`Collective with slug ${args.collective.slug} not found`);
        collective = c;
      })
      .then(checkPermission)
      // find member
      .then(() => models.Member.findOne({
        where: {
          CreatedByUserId: args.user.id,
          CollectiveId: collective.id,
          role: args.role.toUpperCase()
        }
      }))
      .then(member => {
        if (!member) throw new errors.NotFound("Member not found");
        return member.destroy();
      })
    }
  },
  createOrder: {
    type: OrderType,
    args: {
      order: {
        type: OrderInputType
      }
    },
    resolve(_, args, req) {

      let tier, user, isPaidTier;
      const order = args.order;

      let collective;
      return models.Collective.findBySlug(order.toCollective.slug)
      .then(c => {
        if (!c) {
          throw new Error(`No collective found with slug: ${order.toCollective.slug}`);
        }
        collective = c;
      })
      .then(() => models.Tier.getOrFind({
        id: order.tier.id,
        amount: order.totalAmount / (order.quantity || 1),
        interval: order.interval,
        CollectiveId: collective.id
      }))
      .then(t => {
        if (!t) {
          throw new Error(`No tier found with tier id: ${order.tier.id} for collective slug ${collective.slug}`);
        }
        tier = t;
        isPaidTier = tier.amount > 0;
      })

      // check for available quantity
      .then(() => tier.checkAvailableQuantity(order.quantity))
      .then(enoughQuantityAvailable => enoughQuantityAvailable ? 
            Promise.resolve() : Promise.reject(new Error(`No more tickets left for ${tier.name}`)))

      // make sure if it's a paid tier, we have a payment method attached
      .then(() => isPaidTier && !(order.paymentMethod && (order.paymentMethod.uuid || order.paymentMethod.token)) &&
        Promise.reject(new Error(`This tier requires a payment method`)))
      
      // find or create user
      .then(() => {
        if (order.user.id) {
          if (!req.remoteUser) throw new Error(`You need to be logged in to create an order for an existing user`);
          if (order.user.id !== req.remoteUser.id) throw new Error(`You need to be logged in as user id ${order.user.id}`);
          return order.user;
        }

        const email = order.user.email.toLowerCase();
        return models.User.findOne({
          where: {
            $or: {
              email,
              paypalEmail: email
            }
          }
        })
      })
      .then(u => u || models.User.createUserWithCollective(order.user))
      .tap(u => user = u)
      .then(() => {
        if (tier.maxQuantityPerUser > 0 && order.quantity > tier.maxQuantityPerUser) {
          Promise.reject(new Error(`You can buy up to ${tier.maxQuantityPerUser} ${pluralize('ticket', tier.maxQuantityPerUser)} per person`));
        }
      })
      .then(() => {
        const currency = tier.currency || collective.currency;
        const quantity = order.quantity || 1;
        let totalAmount;
        if (tier.amount) {
          totalAmount = tier.amount * quantity;
        } else {
          totalAmount = order.totalAmount; // e.g. the donor tier doesn't set an amount
        }
        const orderData = {
          CreatedByUserId: user.id,
          FromCollectiveId: args.order.fromCollective ? args.order.fromCollective.id : user.CollectiveId,
          ToCollectiveId: collective.id,
          TierId: tier.id,
          quantity,
          totalAmount,
          currency,
          description: order.description || `${collective.name} - ${tier.name}`,
          publicMessage: order.publicMessage,
          privateMessage: order.privateMessage,
          processedAt: isPaidTier ? null : new Date
        };
        return models.Order.create(orderData)
      })
      // process payment, if needed
      .tap((orderInstance) => {
        if (orderInstance.totalAmount > 0) {
          // if the user is trying to reuse an existing credit card,
          // we make sure it belongs to the logged in user.
          let getPaymentMethod;
          if (order.paymentMethod.uuid) {
            if (!req.remoteUser) throw new errors.Forbidden("You need to be logged in to be able to use a payment method on file");
            getPaymentMethod = models.PaymentMethod.findOne({
              where: {
                uuid: order.paymentMethod.uuid,
                CollectiveId: req.remoteUser.CollectiveId
              }
            }).then(PaymentMethod => {
              if (!PaymentMethod) throw new errors.NotFound(`You don't have a payment method with that uuid`);
              else return PaymentMethod;
            })
          } else {
            const paymentMethodData = {
              ...order.paymentMethod,
              service: "stripe",
              CreatedByUserId: user.id,
              CollectiveId: orderInstance.FromCollectiveId
            };
            if (!paymentMethodData.save) {
              paymentMethodData.identifier = null;
            }
            getPaymentMethod = models.PaymentMethod.create(paymentMethodData);
          }
          return getPaymentMethod
            .tap(paymentMethod => {
              orderInstance.PaymentMethodId = paymentMethod.id;
              return orderInstance.save();
            })
            .then(paymentMethod => {
              // also sends out email
              const payload = {
                order: orderInstance,
                payment: {
                  paymentMethod,
                  amount: orderInstance.totalAmount,
                  interval: tier.interval,
                  currency: orderInstance.currency,
                  description: `${collective.name} - ${tier.name}`
                }
              };
              return paymentsLib.createPayment(payload);
            })
        } else {
          return emailLib.send('ticket.confirmed', user.email, {
            user: user.info,
            collective: collective.info,
            order: orderInstance.info,
            tier: tier && tier.info
          });
        }
      })
      .catch(e => {
        // helps debugging
        console.error(">>> createOrder mutation error: ", e)
        throw e;
      })
    }
  }
}

export default mutations;