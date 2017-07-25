'use strict';

/**
 * Tables:
 *  - Groups => Collectives
 *  - Events => Collectives
 *  - UserGroups => Members
 *  - Donations => Orders
 *  - Responses => Orders
 * 
 * Adds:
 *  - Collective.type: COLLECTIVE / EVENT
 *  - Collective.ParentCollectiveId: For events that belong to a parent collective
 *  - Collective.HostId
 *  - Order.TierId
 *  - Order.title => Order.description
 *  - Order.status:
 *    - PENDING: waiting to be processed
 *    - PROCESSED: a one time order that has been fully processed
 *
 *  - Member.isActive
 *  - Member.slug: backers, sponsors, gold-sponsors, etc. (used for mailing lists and urls)
 *  - Member.description
 *  - Member.role: 
 *    - HOST: is holding money on behalf of the collective
 *    - ADMIN: can approve expenses, aka core contributor / director (previously MEMBER)
 *    - BACKER: has donated money
 *    - CONTRIBUTOR: has donated time (includes free RSVPs to events)
 *    - FOLLOWER: is just interested to follow the updates of the collectives
 * 
 * And populates them
 */
const Promise = require('bluebird');

const cache = {
  collectives: {},
  CollectiveIdForEventId: {},
  CollectiveIdForUserId: {},
  HostIdForGroupId: {}
};

const pluralize = (str) => `${str}s`.replace(/s+$/,'s');

const slugify = (str) => {
  const from  = "ąàáäâãåæćęęèéëêìíïîłńòóöôõøśùúüûñçżź",
        to    = "aaaaaaaaceeeeeeiiiilnoooooosuuuunczz",
        regex = new RegExp('[' + from.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + ']', 'g');

  if (str === null) return '';

  str = String(str).toLowerCase().replace(regex, function(c) {
    return to.charAt(from.indexOf(c)) || '-';
  });

  return str.replace(/[^\w\s-]/g, '').replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();  
}

const getHostId = (sequelize, CollectiveId) => {
  if (cache.HostIdForGroupId[CollectiveId]) return Promise.resolve(cache.HostIdForGroupId[CollectiveId]);
  return sequelize.query(`
    SELECT "UserId" FROM "Members" WHERE "CollectiveId"=:CollectiveId AND role='HOST'
  `, { type: sequelize.QueryTypes.SELECT, replacements: { CollectiveId }})
  .then(ug => {
    const HostId = ug[0] && ug[0].UserId || null;
    if (!HostId) {
      console.error(`No host found for collective id ${CollectiveId}`);
    }
    cache.HostIdForGroupId[CollectiveId] = HostId;
    return HostId;
  });
}

const updateMembersRole = (sequelize) => {
  return sequelize.query(`UPDATE "Members" SET role='ADMIN' WHERE role='MEMBER'`);
}

const getParentCollective = (sequelize, ParentCollectiveId) => {
  if (cache.collectives[ParentCollectiveId]) return Promise.resolve(cache.collectives[ParentCollectiveId]);
  return sequelize.query(`
    SELECT "slug" FROM "Collectives" WHERE "id"=:ParentCollectiveId
  `, { type: sequelize.QueryTypes.SELECT, replacements: { ParentCollectiveId }})
  .then(rows => {
    if (rows && rows.length > 0) {
      cache.collectives[ParentCollectiveId] = rows[0];
      return rows[0];
    } else {
      console.error(`No collective found for collective id ${ParentCollectiveId}`);
    }
  });
}

const getCollectiveIdForEventId = (sequelize, EventId) => {
  if (cache.CollectiveIdForEventId[EventId]) return Promise.resolve(cache.CollectiveIdForEventId[EventId]);
  return sequelize.query(`
    SELECT id FROM "Collectives" WHERE data ->> 'EventId'='${EventId}'
  `, { type: sequelize.QueryTypes.SELECT })
  .then(res => {
    const EventCollectiveId = res && res.length > 0 && res[0].id;
    if (!EventCollectiveId) {
      throw new Error(`No parent collective id found for event id ${EventId}`);
    }
    cache.CollectiveIdForEventId[EventId] = EventCollectiveId;
    return EventCollectiveId;
  });
}

const getCollectiveIdForUserId = (sequelize, UserId) => {
  if (!UserId) return Promise.resolve(null);
  if (cache.CollectiveIdForUserId[UserId]) return Promise.resolve(cache.CollectiveIdForUserId[UserId]);
  return sequelize.query(`
    SELECT id FROM "Collectives" WHERE data ->> 'UserId'='${UserId}'
  `, { type: sequelize.QueryTypes.SELECT })
  .then(res => {
    const UserCollectiveId = res && res.length > 0 && res[0].id;
    if (!UserCollectiveId) {
      console.error(`No parent collective id found for user id ${UserId}`);
      return null;
    }
    cache.CollectiveIdForUserId[UserId] = UserCollectiveId;
    return UserCollectiveId;
  });
}

const createCollectivesForEvents = (sequelize) => {

  const updateTiersForEvents = () => {

    const updateTierForEvent = (tier) => {
      return getCollectiveIdForEventId(sequelize, tier.EventId)
        .then(EventCollectiveId => {
          const type = (tier.type === 'TICKET') ? tier.type : 'TIER';
          return sequelize.query(`UPDATE "Tiers" SET "CollectiveId"=:EventCollectiveId, type=:type WHERE id=:TierId`, { replacements: { EventCollectiveId, TierId: tier.id, type } })
            .then(() => sequelize.query(`UPDATE "Responses" SET "CollectiveId"=:EventCollectiveId WHERE "TierId"=:TierId`, { replacements: { EventCollectiveId, TierId: tier.id } }))
        })
    }
  
    return sequelize.query(`SELECT id, "EventId", type FROM "Tiers" WHERE "EventId" IS NOT NULL`, { type: sequelize.QueryTypes.SELECT })
    .tap(tiers => console.log("Processing", tiers.length, "tiers"))
    .then(tiers => tiers && Promise.map(tiers, updateTierForEvent))    
  }

  const createCollectiveForEvent = (event) => {

    const collective = Object.assign({}, event);
    collective.longDescription = event.description;
    collective.ParentCollectiveId = event.CollectiveId;
    collective.isActive = true;
    collective.type = 'EVENT';
    collective.tags = '{"meetup", "event"}';
    if (event.geoLocationLatLong && event.geoLocationLatLong.coordinates) {
      const [ lat, long ] = event.geoLocationLatLong.coordinates;
      collective.geoLocationLatLong = `POINT(${lat} ${long})`;
    } else {
      delete collective.geoLocationLatLong;
    }
    collective.data = JSON.stringify({ EventId: event.id });
    collective.CreatedByUserId = event.createdByUserId;
    delete collective.id;
    delete collective.description;
    delete collective.CollectiveId;
    delete collective.createdByUserId;

    return getHostId(sequelize, event.CollectiveId)
      .then(HostId => {
        collective.HostId = HostId;
      })
      .then(() => getParentCollective(sequelize, collective.ParentCollectiveId))
      .then(parentCollective => {
        if (!parentCollective) {
          return console.error(">>> Couldn't find a parentCollective for", event);
        }
        collective.slug = `${parentCollective.slug}/events/${event.slug}`;
        return sequelize.query(`
          INSERT INTO "Collectives" ("${Object.keys(collective).join('","')}") VALUES (:${Object.keys(collective).join(",:")})
        `, { replacements: collective });
      })
  }

  return sequelize.query(`SELECT * FROM "Events"`, { type: sequelize.QueryTypes.SELECT })
  .tap(events => console.log("Processing", events.length, "events"))
  .then(events => events && Promise.map(events, createCollectiveForEvent))
  .then(() => updateTiersForEvents());
}


const createCollectivesForUsers = (sequelize) => {

  const createCollectiveForUser = (user) => {

    const collective = {
      isActive: true,
      type: user.isOrganization ? 'ORGANIZATION' : 'USER',
      name: `${user.firstName} ${user.lastName}`,
      slug: user.username,
      logo: user.image, // logo will be renamed to image later on
      CreatedByUserId: user.id,
      tags: '{user}',
      data: JSON.stringify({ UserId: user.id }),
      createdAt: user.createdAt,
      twitterHandle: user.twitterHandle,
      longDescription: user.longDescription,
      website: user.website
    };

    if (user.currency) {
      collective.currency = user.currency;
    }
    if (user.mission) {
      collective.mission = user.mission.replace(/<[^>]+>/g,''); // remove <html>
    }
    if (user.description) {
      collective.description = user.description.replace(/<[^>]+>/g,''); // remove <html>
    }
    return sequelize.query(`
      INSERT INTO "Collectives" ("${Object.keys(collective).join('","')}") VALUES (:${Object.keys(collective).join(",:")})
    `, { replacements: collective })
    .then(() => {
      return getCollectiveIdForUserId(sequelize, user.id).then(CollectiveId => {
        const promises = [];
        promises.push(sequelize.query(`UPDATE "Users" SET "CollectiveId"=:CollectiveId WHERE id=:UserId`, { replacements: { CollectiveId, UserId: user.id } }));
        if (user.role === 'HOST') {
          const member = {
            UserId: user.id,
            CollectiveId,
            role: 'HOST',
            createdAt: user.createdAt,
            updatedAt: new Date
          };
          promises.push(sequelize.query(`
            INSERT INTO "Members" ("${Object.keys(member).join('","')}") VALUES (:${Object.keys(member).join(",:")})
          `, { replacements: member }));
        }
        return Promise.all(promises);
      })  
    })
    .catch(e => {
      console.log(">>> Error inserting collective for user", user.username, "collective", collective, "error:", e);
    });
  }

  return sequelize.query(`SELECT m.role, u.id, "isOrganization", username, "firstName", "lastName", image, u."createdAt", "twitterHandle", mission, u.description, "longDescription", website, currency FROM "Users" u LEFT JOIN (SELECT DISTINCT("UserId") as "UserId", role FROM "Members" WHERE role='HOST') m ON m."UserId"=u.id`, { type: sequelize.QueryTypes.SELECT })
  .tap(users => console.log("Processing", users.length, "users"))
  .then(users => users && Promise.map(users, createCollectiveForUser))
}

const updateResponses = (sequelize) => {

  const updateResponse = (response) => {
    return getCollectiveIdForEventId(sequelize, response.EventId)
      .then(CollectiveId => {
        if (response.status === 'INTERESTED') {
          // We add them as "FOLLOWER" of the new Event Collective in the Members table
          const member = {
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
            UserId: response.UserId,
            CollectiveId: CollectiveId,
            role: 'FOLLOWER'
          };
          return sequelize.query(`
            INSERT INTO "Members" ("${Object.keys(member).join('","')}") VALUES (:${Object.keys(member).join(",:")})
          `, { replacements: member });
        } else if (response.amount > 0) {
          // If the ticket is a paid ticket, there is already an Order recorded, so we just update it
          return sequelize.query(`
            UPDATE "Orders" SET "TierId"=:TierId, "CollectiveId"=:CollectiveId WHERE "ResponseId"=:id
          `, { replacements: response, CollectiveId });
        } else {
          const order = {
            CollectiveId: CollectiveId,
            UserId: response.UserId,
            TierId: response.TierId,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
            deletedAt: response.deletedAt,
            processedAt: response.confirmedAt
          }
          return sequelize.query(`
            INSERT INTO "Orders" ("${Object.keys(order).join('","')}") VALUES (:${Object.keys(order).join(",:")})
          `, { replacements: order });
        }
      });
  }

  return sequelize.query(`SELECT r.*, t.amount FROM "Responses" r LEFT JOIN "Tiers" t ON r."TierId"=t.id`, { type: sequelize.QueryTypes.SELECT })
  .then(responses => Promise.map(responses, updateResponse))

}

const updateCollectives = (sequelize) => {

  const addTiers = (collective) => {
    let tiers = collective.tiers || [];

    const getTierName = (tier) => {
      const name = tier.name && tier.name.toLowerCase();
      if (name.match(/sponsor/)) return 'sponsor';
      if (name.match(/donor/)) return 'donor';
      if (name.match(/member/)) return 'member';
      return 'backer';
    }

    tiers = tiers.map(tier => {

      const tierName = tier.title || tier.name || getTierName(tier);
      const tierSlug = slugify(pluralize(tierName));

      const res = {
        type: 'TIER',
        name: tierName,
        description: tier.description,
        slug: tierSlug,
        currency: collective.currency,
        CollectiveId: collective.id
      }

      if (tier.interval) {
        const interval = tier.interval.replace(/ly/,'');
        if (['month','year'].indexOf(interval) !== -1) {
          res.interval = interval;
        }
      }

      if (tier.button) {
        res.button = tier.button; // call to action
      }

      if (tier.presets && tier.presets.length > 0) {
        const presets = tier.presets.map(p => {
          if (isNaN(p)) return `"${p}"`;
          return p
        })
        res.presets = `[${presets}]`;
      }

      if (tier.range) {
        res.amount = Number(tier.range[0]) * 100;
      } else if (tier.amount) {
        res.amount = Number(tier.amount) * 100;
      } else if (tier.presets && !isNaN(tier.presets[0])) {
        res.amount = Number(tier.presets[0]) * 100;
      }

      if (res.slug === 'donors') {
        delete res.amount;
      }

      return res;
    });

    if (tiers.length === 0) {
      tiers.push({
        name: 'backer',
        type: 'TIER',
        slug: 'backers',
        amount: 200,
        interval: 'month',
        CollectiveId: collective.id,
        currency: collective.currency
      });
      tiers.push({
        name: 'sponsor',
        type: 'TIER',
        slug: 'sponsors',
        amount: 10000,
        interval: 'month',
        CollectiveId: collective.id,
        currency: collective.currency
      });
    }

    const donorTier = tiers.find(t => t.slug === 'donors');
    if (!donorTier) {
      tiers.push({
        type: 'TIER',
        name: 'donor',
        slug: 'donors',
        CollectiveId: collective.id,
        currency: collective.currency
      })
    }
    return Promise.map(tiers, tier => sequelize.query(`
      INSERT INTO "Tiers" ("${Object.keys(tier).join('","')}", "createdAt") VALUES ('${Object.values(tier).join("','")}', :createdAt)
      `, {
        replacements: { createdAt: new Date }
      }))
      .then(() => tiers = null) // save memory
      .then(() => sequelize.query(`SELECT id, "CollectiveId", amount, interval, slug FROM "Tiers" WHERE type='TIER'`, { type: sequelize.QueryTypes.SELECT }));
  }

  const addUserToTiers = ({CollectiveId, UserId}, tiers) => {

    // We order the tiers by amount DESC
    tiers.sort((a,b) => {
      return (b.amount || 0) - (a.amount || 0);
    });
    const stats = { totalDonations: 0, totalDonations: 0 };
    return sequelize.query(`
      SELECT o.id, o."createdAt", o.amount, s.interval, o."CollectiveId", o."TierId"
      FROM "Orders" o LEFT JOIN "Subscriptions" s on o."SubscriptionId" = s.id
      WHERE o."CollectiveId"=:CollectiveId AND o."UserId"=:UserId`, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { CollectiveId, UserId }
    })
    .then(orders => Promise.map(orders, (order) => {
      let tier = {};
      if (order.TierId) {
        tier = { id: order.TierId }
      } else {
        tier = tiers.find(tier => {
          if (tier.CollectiveId !== order.CollectiveId) return false;
          if (tier.amount && order.amount < tier.amount) return false;
          if (tier.interval && (tier.interval !== order.interval)) return false;
          return true;
        });
        if (!tier) {
          console.log("No tier found for order", JSON.stringify(order), "tiers", JSON.stringify(tiers.filter(t => t.CollectiveId === order.CollectiveId)))
        }
      }
      if (!tier || !tier.id) {
        return Promise.resolve();
      }
      return sequelize.query(`UPDATE "Orders" SET "TierId"=:TierId WHERE id=:OrderId`, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { CollectiveId, TierId: tier.id, OrderId: order.id }
      })
      .then(() => sequelize.query(`UPDATE "Members" SET "TierId"=:TierId WHERE "CollectiveId"=:CollectiveId AND "UserId"=:UserId AND role='BACKER'`, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { CollectiveId, UserId, TierId: tier.id }
      }));

    }))
  }

  const addUsersToTiers = (collective, tiers) => {
    return sequelize.query(`SELECT "CollectiveId", "UserId" FROM "Members" WHERE "CollectiveId"=:CollectiveId AND "deletedAt" IS NULL`, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { CollectiveId: collective.id }
    })
    .then(ugs => Promise.map(ugs, (ug) => addUserToTiers(ug, tiers)))
  }

  /**
   * updateCollective
   * - Add Collective.HostId
   * - Add Collective.ParentCollectiveId (Collective of the Host)
   * - Add tiers to the new "Tiers" table
   * - Attach users to their respective tier
   */ 
  const updateCollective = (collective) => {

    // We don't process EVENT, USER or ORGANIZATION collectives
    if (collective.type !== 'COLLECTIVE') return Promise.resolve();

    let hostid;
    return addTiers(collective)
      .then((tiers) => addUsersToTiers(collective, tiers))
      .then(() => getHostId(sequelize, collective.id))
      .tap(id => hostid = id)
      .then((HostId) => getCollectiveIdForUserId(sequelize, HostId))
      .then(ParentCollectiveId => {
        // if (!hostid) throw new Error(`Unable to update collective ${collective.id}: No HostId for collective ${collective.slug}`);
        return sequelize.query(`UPDATE "Collectives" SET "HostId"=:hostid, "ParentCollectiveId"=:ParentCollectiveId WHERE id=:id AND type='COLLECTIVE'`,
          { replacements: { id: collective.id, hostid, ParentCollectiveId } });
      })
  }

  return sequelize.query(`SELECT id, slug, type, mission, description, currency, tiers FROM "Collectives"`, { type: sequelize.QueryTypes.SELECT })
  .then(collectives => collectives && Promise.map(collectives, updateCollective))
}


const up = (queryInterface, Sequelize) => {

  const removeTableColumns = (table, cols) => {
    return Promise.map(cols, col => queryInterface.removeColumn(table, col));
  }

  const updateTableSchema = (fromTable, toTable) => {
    return queryInterface.renameTable(fromTable, toTable)
      .then(() => queryInterface.addColumn(toTable, 'CreatedByUserId', {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }))
      .then(() => queryInterface.renameColumn(toTable, 'lastEditedByUserId', 'LastEditedByUserId')) // Foreign Keys should respect the pattern "UserId" (camel case)
      .then(() => queryInterface.addColumn(toTable, 'HostId', {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }))
      .then(() => queryInterface.addColumn(toTable, 'ParentCollectiveId', {
        type: Sequelize.INTEGER,
        references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }))
      .then(() => queryInterface.addColumn(toTable, 'type', { type: Sequelize.STRING, defaultValue: "COLLECTIVE" }))
      .then(() => queryInterface.addColumn(toTable, 'startsAt', { type: Sequelize.DATE }))
      .then(() => queryInterface.addColumn(toTable, 'endsAt', { type: Sequelize.DATE }))
      .then(() => queryInterface.addColumn(toTable, 'locationName', { type: Sequelize.STRING }))
      .then(() => queryInterface.addColumn(toTable, 'address', { type: Sequelize.STRING }))
      .then(() => queryInterface.addColumn(toTable, 'timezone', { type: Sequelize.STRING }))
      .then(() => queryInterface.addColumn(toTable, 'maxAmount', { type: Sequelize.INTEGER, min: 0 }))
      .then(() => queryInterface.addColumn(toTable, 'maxQuantity', { type: Sequelize.INTEGER, min: 0 }))
      .then(() => queryInterface.addColumn(toTable, 'geoLocationLatLong', { type: Sequelize.GEOMETRY('POINT') }))
  }

  return updateTableSchema('Groups', 'Collectives')
    .then(() => updateTableSchema('GroupHistories', 'CollectiveHistories'))
    .then(() => queryInterface.addColumn('Users', 'CollectiveId', {
      type: Sequelize.INTEGER,
      references: { model: 'Collectives', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
    .then(() => queryInterface.renameTable('Donations', 'Orders'))
    .then(() => queryInterface.addColumn('Orders', 'TierId', {
      type: Sequelize.INTEGER,
      references: { model: 'Tiers', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
    .then(() => queryInterface.renameColumn('Orders', 'title', 'description'))
    .then(() => queryInterface.renameColumn('Expenses', 'title', 'description'))
    .then(() => queryInterface.renameColumn('Expenses', 'notes', 'privateMessage'))
    .then(() => queryInterface.renameColumn('Expenses', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('ExpenseHistories', 'title', 'description'))
    .then(() => queryInterface.renameColumn('ExpenseHistories', 'notes', 'privateMessage'))
    .then(() => queryInterface.renameColumn('ExpenseHistories', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('Orders', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.addColumn('Orders', 'publicMessage', { type: Sequelize.STRING }))
    .then(() => queryInterface.renameColumn('Orders', 'notes', 'privateMessage'))
    .then(() => queryInterface.addColumn('Orders', 'quantity', { type: Sequelize.INTEGER, min: 0 }))
    .then(() => queryInterface.renameColumn('Responses', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('Activities', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('Comments', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('ConnectedAccounts', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('Events', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('Notifications', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.renameColumn('Transactions', 'netAmountInGroupCurrency', 'netAmountInCollectiveCurrency'))
    .then(() => queryInterface.renameColumn('Transactions', 'DonationId', 'OrderId'))
    .then(() => queryInterface.renameColumn('Transactions', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.addColumn('Tiers', 'button', { type: Sequelize.STRING }))
    .then(() => queryInterface.addColumn('Tiers', 'presets', { type: Sequelize.JSON }))
    .then(() => queryInterface.renameColumn('Tiers', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.changeColumn('Tiers', 'interval', {
      type: Sequelize.STRING(8),
      defaultValue: null
    }))
    .then(() => queryInterface.changeColumn('Subscriptions', 'interval', {
      type: Sequelize.STRING(8),
      defaultValue: null
    }))
    .then(() => queryInterface.renameTable('UserGroups', 'Members'))
    .then(() => queryInterface.renameColumn('Users', 'avatar', 'image'))
    .then(() => queryInterface.renameColumn('Members', 'GroupId', 'CollectiveId'))
    .then(() => queryInterface.addColumn('Members', 'description', { type: Sequelize.STRING }))
    .then(() => queryInterface.addColumn('Members', 'TierId', {
      type: Sequelize.INTEGER,
      references: { model: 'Tiers', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
    .then(() => queryInterface.removeIndex('Members', 'UserGroups_3way'))
    .then(() => queryInterface.addIndex('Members', ['UserId', 'CollectiveId', 'role'], { indexName: 'UserId-CollectiveId-role' }))
    .then(() => createCollectivesForEvents(queryInterface.sequelize))
    .then(() => createCollectivesForUsers(queryInterface.sequelize))
    .then(() => updateCollectives(queryInterface.sequelize))
    .then(() => updateResponses(queryInterface.sequelize))
    .then(() => updateMembersRole(queryInterface.sequelize))
    .then(() => queryInterface.removeColumn('Orders', 'isProcessed'))
    .then(() => queryInterface.removeColumn('Orders', 'ResponseId'))
    .then(() => queryInterface.removeColumn('Tiers', 'EventId'))
    .then(() => queryInterface.removeColumn('Responses', 'EventId'))
    .then(() => removeTableColumns('Users', ['username', 'image','mission','description','longDescription','website','twitterHandle','ApplicationId','_access']))
    .then(() => removeTableColumns('Collectives', ['tiers', 'image', 'video', 'burnrate', 'budget', 'expensePolicy','whyJoin']))
    .then(() => queryInterface.renameColumn('Collectives', 'logo', 'image'))
    .then(() => removeTableColumns('CollectiveHistories', ['tiers', 'image', 'video', 'burnrate', 'budget', 'expensePolicy','whyJoin']))
    .then(() => queryInterface.renameColumn('CollectiveHistories', 'logo', 'image'))
    .then(() => queryInterface.removeColumn('PaymentMethods', 'identifier'))
    .then(() => queryInterface.renameColumn('PaymentMethods', 'number', 'identifier'))
    .then(() => queryInterface.dropTable('ApplicationGroup'))
    .then(() => queryInterface.dropTable('Applications'))
    .then(() => queryInterface.dropTable('Events'))
    .then(() => queryInterface.dropTable('Responses'))
    .catch(e => {
      console.error("Error during migration.", e);
      throw e;
    })
};

const down = () => {
  console.error("No downgrade possible, please revert to a backup");
}

module.exports = {
  up,
  down
};
