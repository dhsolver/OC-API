import Promise from 'bluebird';

import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql';

import {
  CollectiveInterfaceType
} from './CollectiveInterface';

import {
  TransactionInterfaceType  
} from './TransactionInterface';

import {
  UserType,
  TierType,
  ExpenseType,
  MemberType
} from './types';

import models from '../models';
import rawQueries from '../lib/queries';
import { fetchCollectiveId } from '../lib/cache';

const queries = {
  Collective: {
    type: CollectiveInterfaceType,
    args: {
      slug: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(_, args) {
      return models.Collective.findBySlug(args.slug);
    }
  },

  Tier: {
    type: TierType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(_, args) {
      return models.Tier.findById(args.id);
    }
  },

  LoggedInUser: {
    type: UserType,
    resolve(_, args, req) {
      return req.remoteUser;
    }
  },

  /*
   * Given a collective slug, returns all transactions
   */
  allTransactions: {
    type: new GraphQLList(TransactionInterfaceType),
    args: {
      CollectiveId: { type: new GraphQLNonNull(GraphQLInt) },
      type: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt }
    },
    resolve(_, args) {
      const query = {
        where: { CollectiveId: args.CollectiveId },
        order: [ ['createdAt', 'DESC'] ]
      };
      if (args.type) query.where.type = args.type;
      if (args.limit) query.limit = args.limit;
      if (args.offset) query.offset = args.offset;
      return models.Transaction.findAll(query);
    }
  },

  /*
   * Given a collective slug, returns all expenses
   */
  allExpenses: {
    type: new GraphQLList(ExpenseType),
    args: {
      CollectiveId: { type: new GraphQLNonNull(GraphQLInt) },
      includeHostedCollectives: { type: GraphQLBoolean },
      status: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt }
    },
    resolve(_, args, req) {
      const query = { where: {} };
      if (args.status) query.where.status = args.status;
      if (args.limit) query.limit = args.limit;
      if (args.offset) query.offset = args.offset;
      query.order = [["incurredAt", "DESC"]];
      return req.loaders.collective.findById.load(args.CollectiveId)
        .then(collective => {
          if (!collective) {
            throw new Error('Collective not found');
          }
          const getCollectiveIds = () => {
            // if is host, we get all the expenses across all the hosted collectives
            if (args.includeHostedCollectives) {
              return models.Member.findAll({
                where: {
                  MemberCollectiveId: collective.id,
                  role: 'HOST'
                }
              }).map(members => members.CollectiveId)
            } else {
              return Promise.resolve([args.CollectiveId]);
            }
          }
          return getCollectiveIds().then(collectiveIds => {
            query.where.CollectiveId = { $in: collectiveIds };
            return models.Expense.findAll(query);
          })
        })
    }
  },

  /*
   * Given an Expense id, returns the expense details
   */
  Expense: {
    type: ExpenseType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(_, args) {
      return models.Expense.findById(args.id);
    }
  },

  /*
   * Given a Transaction id, returns a transaction details
   */
  Transaction: {
    type: TransactionInterfaceType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve(_, args) {
      return models.Transaction.findOne({ where: { id: args.id }});
    }
  },

  /*
   * Returns all collectives
   */
  allCollectives: {
    type: new GraphQLList(CollectiveInterfaceType),
    args: {
      tags: { type: new GraphQLList(GraphQLString) },
      type: {
        type: GraphQLString,
        description: "COLLECTIVE (default), USER, ORGANIZATION, EVENT"
      },
      HostCollectiveId: { type: GraphQLInt },
      hostCollectiveSlug: {
        type: GraphQLString,
        description: "Fetch all collectives hosted by hostCollectiveSlug"
      },
      memberOfCollectiveSlug: {
        type: GraphQLString,
        description: "Fetch all collectives that `memberOfCollectiveSlug` is a member of"
      },
      role: {
        type: GraphQLString,
        description: "Only fetch the collectives where `memberOfCollectiveSlug` has the specified role"
      },
      ParentCollectiveId: {
        type: GraphQLInt,
        description: "Fetch all collectives that are a child of `ParentCollectiveId`. Used for \"SuperCollectives\""
      },
      orderBy: { type: GraphQLString },
      orderDirection: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt }
    },
    async resolve(_, args) {
      const query = {
        where: {},
        limit: args.limit || 10,
        include: []
      };

      if (args.hostCollectiveSlug) {
        args.HostCollectiveId = await fetchCollectiveId(args.hostCollectiveSlug);
      }

      if (args.memberOfCollectiveSlug) {
        args.memberOfCollectiveId = await fetchCollectiveId(args.memberOfCollectiveSlug);
      }

      if (args.memberOfCollectiveId) {
        const memberCond = {
          model: models.Member,
          required: true,
          where: {
            MemberCollectiveId: args.memberOfCollectiveId
          }
        };
        if (args.role) memberCond.where.role = args.role.toUpperCase();
        query.include.push(memberCond);
      }

      if (args.HostCollectiveId) query.where.HostCollectiveId = args.HostCollectiveId;
      if (args.ParentCollectiveId) query.where.ParentCollectiveId = args.ParentCollectiveId;

      if (args.orderBy === 'balance' && (args.ParentCollectiveId || args.HostCollectiveId)) {
        return rawQueries.getCollectivesWithBalance(query.where, args);
      } else {
        query.order = [['name', 'ASC']];
      }

      if (args.tags) query.where.tags = { $overlap: args.tags };
      if (args.type) query.where.type = args.type;
      if (args.offset) query.offset = args.offset;
      return models.Collective.findAll(query);
    }
  },

  /*
   * Given a collective slug, returns all members/memberships
   */
  allMembers: {
    type: new GraphQLList(MemberType),
    args: {
      CollectiveId: { type: GraphQLInt },
      collectiveSlug: { type: GraphQLString },
      memberCollectiveSlug: { type: GraphQLString },
      TierId: { type: GraphQLInt },
      role: { type: GraphQLString },
      type: { type: GraphQLString },
      orderBy: { type: GraphQLString },
      orderDirection: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt }
    },
    async resolve(_, args) {
      if (!args.CollectiveId && !args.collectiveSlug && !args.memberCollectiveSlug) {
        throw new Error("Please provide a CollectiveId, a collectiveSlug or a memberCollectiveSlug");
      }

      if (args.collectiveSlug) {
        args.CollectiveId = await fetchCollectiveId(args.collectiveSlug);
      }

      if (args.memberCollectiveSlug) {
        args.MemberCollectiveId = await fetchCollectiveId(args.memberCollectiveSlug);
      }

      const attr = args.CollectiveId ? 'CollectiveId' : 'MemberCollectiveId';
      const where = { [attr]: args[attr] };
      if (args.role) where.role = args.role.toUpperCase();
      if (where.role === 'HOST') {
        where.HostCollectiveId = args.MemberCollectiveId;
      }
      if (["totalDonations", "balance"].indexOf(args.orderBy) !== -1) {
        const queryName = (args.orderBy === 'totalDonations') ? "getMembersWithTotalDonations" : "getMembersWithBalance";
        return rawQueries[queryName](where, args)
          .map(collective => {
            const res = {
              id: collective.dataValues.MemberId,
              role: collective.dataValues.role,
              createdAt: collective.dataValues.createdAt,
              CollectiveId: collective.dataValues.CollectiveId,
              MemberCollectiveId: collective.dataValues.MemberCollectiveId,
              totalDonations: collective.dataValues.totalDonations
            }
            if (attr === 'CollectiveId') {
              res.memberCollective = collective;
            } else {
              res.collective = collective;
            }
            return res;
          });
      } else {
        const query = { where: {}, include: [] };
        if (args.CollectiveId) query.where.CollectiveId = args.CollectiveId;
        if (args.MemberCollectiveId) query.where.MemberCollectiveId = args.MemberCollectiveId;
        if (args.TierId) query.where.TierId = args.TierId;
        if (args.role) query.where.role = args.role;
        if (args.type) {
          const types = args.type.split(',');
          query.include.push(
            {
              model: models.Collective,
              as: 'memberCollective',
              required: true,
              where: { type: { $in: types } }
            }
          );
        }
        if (args.limit) query.limit = args.limit;
        if (args.offset) query.offset = args.offset;
        return models.Member.findAll(query);
      }
    }
  },

  /*
   * Given a collective slug, returns all events
   */
  allEvents: {
    type: new GraphQLList(CollectiveInterfaceType),
    args: {
      slug: {
        type: GraphQLString
      }
    },
    resolve(_, args) {
      if (args.slug) {
        return models.Collective
          .findBySlug(args.slug, { attributes: ['id'] })
          .then(collective => models.Collective.findAll({
            where: { ParentCollectiveId: collective.id, type: 'EVENT' },
            order: [['startsAt', 'DESC'], ['createdAt', 'DESC']]
          }))
          .catch(e => {
            console.error(e.message);
            return [];
          })
      } else {
        return models.Collective.findAll({ where: { type: 'EVENT' }});
      }
    }
  }
}

export default queries;