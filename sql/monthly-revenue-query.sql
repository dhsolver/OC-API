-- Revenue and transaction splits by month with all currencies
-- converted to USD.
--
-- Note: the exchange rates are from March 11, 2016

with conversions as (select
    date_trunc('month', t."createdAt") as "givenMonth",

    /* deal with currency */
    CASE
        WHEN (t.currency = 'USD') THEN t.amount / 1
        WHEN (t.currency = 'EUR') THEN t.amount / 0.9
        WHEN (t.currency = 'MXN') THEN t.amount / 17.7
        WHEN (t.currency = 'AUD') THEN t.amount / 13.2
        WHEN (t.currency = 'CAD') THEN t.amount / 1.3
        WHEN (t.currency = 'INR') THEN t.amount / 66.97
        WHEN (t.currency = 'SEK') THEN t.amount / 8.34
        WHEN (t.currency = 'GBP') THEN t.amount / 0.71
        ELSE 0
    END AS "amountInUSD",
    CASE
        WHEN (t.currency = 'USD') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 1
        WHEN (t.currency = 'EUR') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 0.9
        WHEN (t.currency = 'MXN') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 17.7
        WHEN (t.currency = 'AUD') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 1.32
        WHEN (t.currency = 'CAD') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 1.30
        WHEN (t.currency = 'INR') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 66.97
        WHEN (t.currency = 'SEK') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 8.34
        WHEN (t.currency = 'GBP') AND t.amount > 0 THEN t."platformFeeInHostCurrency" / 0.71
        ELSE 0
    END AS "platformFeeInUSD",

    /*
    Generate donations categories
    - added-funds (manually added funds - we didn't get a platform fee)
    // for rest of these we charge a fee
    - recurringMonthlyNew (new monthly subscription in this month)
    - recurringMonthlyOld (carryover monthly subscription in this month)
    - recurringAnnualNew (new annual subscription this month)
    - recurringAnnualOld (carryover annual subscription renewed this month)
    - one-time (one-time donations)

    */

    CASE
        WHEN
            t.amount > 0 AND t."OrderId" IS NOT NULL AND
            (t."platformFeeInHostCurrency" = 0 OR t."platformFeeInHostCurrency" IS NULL)
        THEN 1
        ELSE 0
    END AS addedFunds,


    CASE
        WHEN t.amount > 0 AND
        d."SubscriptionId" is NULL AND
        (t."platformFeeInHostCurrency" is not null AND t."platformFeeInHostCurrency" != 0)
        THEN 1
        ELSE 0
    END AS oneTimeDonations,

    CASE
        WHEN
            t.amount > 0 AND
            (t."platformFeeInHostCurrency" IS NOT NULL AND t."platformFeeInHostCurrency" != 0) AND
            d."SubscriptionId" is NOT NULL AND s."interval" like 'month%'
        THEN 1
        ELSE 0
    END AS recurringMonthlyTotal,

    CASE
        WHEN
            t.amount > 0 AND t."OrderId" IS NOT NULL AND
            (t."platformFeeInHostCurrency" IS NOT NULL AND t."platformFeeInHostCurrency" != 0) AND
            d."SubscriptionId" is NOT NULL AND s."interval" like 'month%' AND
            date_trunc('month', t."createdAt") = date_trunc('month', s."activatedAt")
        THEN 1
        ELSE 0
    END AS recurringMonthlyNew,

    CASE
        WHEN
            t.amount > 0 AND
            (t."platformFeeInHostCurrency" IS NOT NULL AND t."platformFeeInHostCurrency" != 0) AND
            d."SubscriptionId" is NOT NULL AND s."interval" like 'month%' AND
            date_trunc('month', t."createdAt") > date_trunc('month', s."activatedAt")
        THEN 1
        ELSE 0
    END AS recurringMonthlyOld,

    CASE
        WHEN
            t.amount > 0 AND
            (t."platformFeeInHostCurrency" IS NOT NULL AND t."platformFeeInHostCurrency" != 0) AND
            d."SubscriptionId" is NOT NULL AND s."interval" like 'year%'
        THEN 1
        ELSE 0
    END AS recurringAnnuallyTotal,

    CASE
        WHEN
            t.amount > 0 AND
            (t."platformFeeInHostCurrency" IS NOT NULL AND t."platformFeeInHostCurrency" != 0) AND
            d."SubscriptionId" is NOT NULL AND s."interval" like 'year%' AND
            date_trunc('month', t."createdAt") = date_trunc('month', s."activatedAt")
        THEN 1
        ELSE 0
    END AS recurringAnnuallyNew,

    CASE
        WHEN
            t.amount > 0 AND
            (t."platformFeeInHostCurrency" IS NOT NULL AND t."platformFeeInHostCurrency" != 0) AND
            d."SubscriptionId" is NOT NULL AND s."interval" like 'year%' AND
            date_trunc('month', t."createdAt") > date_trunc('month', s."activatedAt")
        THEN 1
        ELSE 0
    END AS recurringAnnuallyOld,

    /*
    Generate expenses categories
    - total (all expenses recorded)
    - manual (submitted but no money exchanged from us)
    - paypal (paid through paypal)
    */

    CASE
        WHEN
            t.amount < 0 AND t."ExpenseId" IS NOT NULL
        THEN 1
        ELSE 0
    END AS totalExpensesRecorded,

    CASE
        WHEN
            t.amount < 0 AND t."ExpenseId" IS NOT NULL AND
            t."PaymentMethodId" IS NULL
        THEN 1
        ELSE 0
    END AS manualExpenses,

    CASE
        WHEN
            t.amount < 0 AND t."ExpenseId" IS NOT NULL AND
            t."PaymentMethodId" IS NOT NULL
        THEN 1
        ELSE 0
    END AS paypalExpenses,

    /*
    Generate user categories
    - backer
    - sponsor (org)
    */

    CASE
        WHEN (fc.type ilike 'user') THEN 1
        ELSE 0
    END as "isUser",

    CASE
        WHEN (fc.type ilike 'organization') THEN 1
        ELSE 0
    END as "isOrg"

    FROM "Transactions" t
    LEFT JOIN "Orders" d on t."OrderId" = d.id
    LEFT JOIN "Subscriptions" s on d."SubscriptionId" = s.id
    LEFT JOIN "Collectives" fc on t."FromCollectiveId" = fc.id
    WHERE
        t."deletedAt" IS NULL AND t."RefundTransactionId" IS NULL AND
        t."createdAt" BETWEEN '2016/01/01' AND '2020/01/01' AND
        d."deletedAt" IS NULL AND
        s."deletedAt" IS NULL)

/* End temporary table */

SELECT
    to_char("givenMonth", 'YYYY-mm') as "month",

    /* donations */
    (SUM("amountInUSD" * recurringMonthlyTotal +
        "amountInUSD" * recurringAnnuallyTotal +
        "amountInUSD" * oneTimeDonations +
        "amountInUSD" * addedFunds)/100)::DECIMAL(10,0)::money
        AS "totalMoneyBroughtIntoPlatformInUSD",

    (SUM("amountInUSD" * recurringMonthlyTotal +
        "amountInUSD" * recurringAnnuallyTotal +
        "amountInUSD" * oneTimeDonations)/100)::DECIMAL(10,0)::money
        AS "totalDonationsMadeOnPlatformInUSD",

    (SUM("platformFeeInUSD")/-100)::DECIMAL(10,0)::money AS "OCFeeInUSD",

    /* monthly donations */

      /* total donations */
      (SUM("amountInUSD" * recurringMonthlyTotal)/100)::DECIMAL(10,0)::money AS "recurringMonthlyTotalDonationsInUSD",
      (SUM("amountInUSD" * recurringMonthlyTotal * "isUser")/100)::DECIMAL(10,0)::money AS "recurringMonthlyTotalDonationsFromUsersInUSD",
      (SUM("amountInUSD" * recurringMonthlyTotal * "isOrg")/100)::DECIMAL(10,0)::money AS "recurringMonthlyTotalDonationsFromOrgsInUSD",

      /* old donations */
      (SUM("amountInUSD" * recurringMonthlyOld)/100)::DECIMAL(10,0)::money AS "recurringMonthlyOldDonationsInUSD",
      (SUM("amountInUSD" * recurringMonthlyOld * "isUser")/100)::DECIMAL(10,0)::money AS "recurringMonthlyOldDonationsFromUsersInUSD",
      (SUM("amountInUSD" * recurringMonthlyOld * "isOrg")/100)::DECIMAL(10,0)::money AS "recurringMonthlyOldDonationsFromOrgsInUSD",

      /* new donations */
      (SUM("amountInUSD" * recurringMonthlyNew)/100)::DECIMAL(10,0)::money AS "recurringMonthlyNewDonationsInUSD",
      (SUM("amountInUSD" * recurringMonthlyNew * "isUser")/100)::DECIMAL(10,0)::money AS "recurringMonthlyNewDonationsFromUsersInUSD",
      (SUM("amountInUSD" * recurringMonthlyNew * "isOrg")/100)::DECIMAL(10,0)::money AS "recurringMonthlyNewDonationsFromOrgsInUSD",

    /* annual donations */

      /* total donations */
      (SUM("amountInUSD" * recurringAnnuallyTotal)/100)::DECIMAL(10,0)::money AS "recurringAnnualDonationsInUSD",
      (SUM("amountInUSD" * recurringAnnuallyTotal * "isUser")/100)::DECIMAL(10,0)::money AS "recurringAnnuallyTotalDonationsFromUsersInUSD",
      (SUM("amountInUSD" * recurringAnnuallyTotal * "isOrg")/100)::DECIMAL(10,0)::money AS "recurringAnnuallyTotalDonationsFromOrgsInUSD",

      /* old donations */
      (SUM("amountInUSD" * recurringAnnuallyOld)/100)::DECIMAL(10,0)::money AS "recurringAnnuallyOldDonationsInUSD",
      (SUM("amountInUSD" * recurringAnnuallyOld * "isUser")/100)::DECIMAL(10,0)::money AS "recurringAnnuallyOldDonationsFromUsersInUSD",
      (SUM("amountInUSD" * recurringAnnuallyOld * "isOrg")/100)::DECIMAL(10,0)::money AS "recurringAnnuallyOldDonationsFromOrgsInUSD",

      /* new donations */
      (SUM("amountInUSD" * recurringAnnuallyNew)/100)::DECIMAL(10,0)::money AS "recurringAnnuallyNewDonationsInUSD",
      (SUM("amountInUSD" * recurringAnnuallyNew * "isUser")/100)::DECIMAL(10,0)::money AS "recurringAnnuallyNewDonationsFromUsersInUSD",
      (SUM("amountInUSD" * recurringAnnuallyNew * "isOrg")/100)::DECIMAL(10,0)::money AS "recurringAnnuallyNewDonationsFromOrgsInUSD",

    /* one-time donations */
    (SUM("amountInUSD" * oneTimeDonations)/100)::DECIMAL(10,0)::money AS "oneTimeDonationsInUSD",
    (SUM("amountInUSD" * oneTimeDonations * "isUser")/100)::DECIMAL(10,0)::money AS "oneTimeDonationsFromUsersInUSD",
    (SUM("amountInUSD" * oneTimeDonations * "isOrg")/100)::DECIMAL(10,0)::money AS "oneTimeDonationsFromOrgsInUSD",

    /* added funds */
    (SUM("amountInUSD" * addedFunds)/100):: DECIMAL(10,0)::money AS "addedFundsInUSD",

    /* expenses */
    (SUM("amountInUSD" * totalExpensesRecorded)/100)::DECIMAL(10,0)::money AS "expensesPaidInUSD",
    (SUM("amountInUSD" * manualExpenses)/100)::DECIMAL(10,0)::money AS "manualExpensesInUSD",
    (SUM("amountInUSD" * paypalExpenses)/100)::DECIMAL(10,0)::money AS "paypalExpensesInUSD",

    /* counts of transactions */
    COUNT(*)/2 AS "numTransactions",
    SUM(recurringMonthlyTotal + recurringAnnuallyTotal + oneTimeDonations + addedFunds) AS "numMoneyBroughtInEntries",
    SUM(recurringMonthlyTotal + recurringAnnuallyTotal + oneTimeDonations) AS "numDonationMadeOnPlatformEntries",

    /* monthly */
    SUM(recurringMonthlyTotal) as "numRecurringMonthlyTotalDonations",
    SUM(recurringMonthlyTotal * "isUser") as "numRecurringMonthlyTotalDonationsFromUsers",
    SUM(recurringMonthlyTotal * "isOrg") as "numRecurringMonthlyTotalDonationsFromOrgs",

    SUM(recurringMonthlyOld) as "numRecurringMonthlyOldDonations",
    SUM(recurringMonthlyOld * "isUser") as "numRecurringMonthlyOldDonationsFromUsers",
    SUM(recurringMonthlyOld * "isOrg") as "numRecurringMonthlyOldDonationsFromOrgs",

    SUM(recurringMonthlyNew) as "numRecurringMonthlyNewDonations",
    SUM(recurringMonthlyNew * "isUser") as "numRecurringMonthlyNewDonationsFromUsers",
    SUM(recurringMonthlyNew * "isOrg") as "numRecurringMonthlyNewDonationsFromOrgs",

    /* annually */
    SUM(recurringAnnuallyTotal) as "numRecurringAnnualDonations",
    SUM(recurringAnnuallyTotal * "isUser") as "numRecurringAnnuallyTotalDonationsFromUsers",
    SUM(recurringAnnuallyTotal * "isOrg") as "numRecurringAnnuallyTotalDonationsFromOrgs",

    SUM(recurringAnnuallyOld) as "numRecurringAnnuallyOldDonations",
    SUM(recurringAnnuallyOld * "isUser") as "numRecurringAnnuallyOldDonationsFromUsers",
    SUM(recurringAnnuallyOld * "isOrg") as "numRecurringAnnuallyOldDonationsFromOrgs",

    SUM(recurringAnnuallyNew) as "numRecurringAnnuallyNewDonations",
    SUM(recurringAnnuallyNew * "isUser") as "numRecurringAnnuallyNewDonationsFromUsers",
    SUM(recurringAnnuallyNew * "isOrg") as "numRecurringAnnuallyNewDonationsFromOrgs",

        /* one-time */
        SUM(oneTimeDonations) as "numOneTimeDonations",
        SUM(oneTimeDonations * "isUser") as "numOneTimeDonationsFromUsers",
        SUM(oneTimeDonations * "isOrg") as "numOneTimeDonationsFromOrgs",

    SUM(addedFunds) as "numAddedFunds",
    SUM(totalExpensesRecorded) as "numExpensesPaid"

FROM conversions
GROUP BY "givenMonth"
ORDER BY "givenMonth"
