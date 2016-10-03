/*
id | groupName
-- | ---------
 7 | tipbox
 8 | yeoman
43 | apex
58 | mochajs
66 | opencollective foundation
104| replaylastgoal
*/

DELETE FROM "UserGroups" WHERE "GroupId" != ALL('{7,8,43,58,66,104}');

/* Delete from Expenses anything where there isn't a UserId or GroupId in UserGroup anymore */
/* Necessary to delete those users later */
DELETE FROM "Expenses" where "UserId" NOT IN (SELECT "UserId" FROM "UserGroups");
DELETE FROM "Expenses" where "GroupId" NOT IN (SELECT "GroupId" FROM "UserGroups");

/* Delete any Transactions that doesn't have a user or group in UserGroup */
DELETE FROM "Transactions" where "UserId" NOT IN (SELECT "UserId" FROM "UserGroups");
DELETE FROM "Transactions" where "GroupId" NOT IN (SELECT "GroupId" FROM "UserGroups");

/* Delete users who are not part of the groups that we keep */
DELETE FROM "Users" where id NOT IN (SELECT "UserId" FROM "UserGroups");

/* we obfuscate users' email address and tokens */
UPDATE "Users" SET email=md5(random()::text) || '@gmail.com',_salt='*****',refresh_token='*****',"resetPasswordTokenHash"='*****',password_hash='*****',"seenAt"=NULL,"paypalEmail"='*****';

/* Delete groups who are not part of the groups that we keep */
DELETE FROM "Groups" where id NOT IN (SELECT "GroupId" FROM "UserGroups");

/* We delete the ConnectedAccounts who don't have a UserId anymore */
DELETE FROM "ConnectedAccounts" WHERE "UserId" IS NULL;

/* We erase their clientId and secret */
UPDATE "ConnectedAccounts" SET "clientId"='*****',"secret"='*****';

/* We delete all notifications that don't have a GroupId anymore */
DELETE FROM "Notifications" WHERE "GroupId" IS NULL;
UPDATE "Notifications" SET "webhookUrl"='http://****';

/* We delete all transactions that don't have a GroupId anymore */
DELETE FROM "Transactions" WHERE "GroupId" IS NULL;
UPDATE "Transactions" SET data = NULL, "stripeSubscriptionId" = 'sub_xxxx' ;

/* We only keep the PDF or image receipt for the Tipbox collective */
UPDATE "Transactions" SET link='' WHERE "GroupId" != 7;

/* We delete all donations that don't have a GroupId anymore */
DELETE FROM "Donations" WHERE "GroupId" IS NULL;

/* We delete all subscriptions that don't have a parent donation anymore */
DELETE FROM "Subscriptions" WHERE id NOT IN (SELECT "SubscriptionId" FROM "Donations");
UPDATE "Subscriptions" SET data = NULL, "stripeSubscriptionId"='*****';

/* We only keep the StripeAccounts from Users that remain (their stripePublishableKey have already been sanitized) */
DELETE FROM "StripeAccounts" WHERE id NOT IN (SELECT "StripeAccountId" FROM "Users");
UPDATE "StripeAccounts" SET "accessToken"='*****', "refreshToken"='*****';

DELETE FROM "PaymentMethods" WHERE "UserId" IS NULL;
UPDATE "PaymentMethods" SET token='*****', data=NULL, number='*****@paypal.com', "customerId"='*****';

TRUNCATE "Activities";
TRUNCATE "ExpenseHistories";