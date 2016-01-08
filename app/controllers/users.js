/**
 * Dependencies.
 */
var _ = require('lodash');
var Bluebird = require('bluebird');

/**
 * Controller.
 */
module.exports = function(app) {

  /**
   * Internal Dependencies.
   */
  var models = app.set('models');
  var User = models.User;
  var Activity = models.Activity;
  var UserGroup = models.UserGroup;
  var StripeManagedAccount = models.StripeManagedAccount;
  var groups = require('../controllers/groups')(app);

  /**
   * Private methods.
   */

  var getUserGroups = function(userId) {
    return UserGroup.findAll({
      where: {
        UserId: userId
      }
    })
    .then(function(userGroups) {
      return _.pluck(userGroups, 'info');
    });
  };

  var getGroupsFromUser = function(req, options) {
    return req.user
      .getGroups(options)
      .map(function(group) { // sequelize uses bluebird
        var account = group.StripeManagedAccount;

        return _.extend(group.info, {
          activities: group.Activities,
          stripeManagedAccount: account ? account.info : undefined
        });
      });
  };

  var getGroupsFromUserWithRoles = function(req, options) {

    /**
     * This isn't the best way to get the user role but I couldn't find a
     * clean way to do it with sequelize. If you find it, please refactor.
     */

    return Bluebird.props({
      usergroups: getUserGroups(req.user.id),
      groups: getGroupsFromUser(req, options)
    })
    .then(function(props) {
      var usergroups = props.usergroups || [];
      var groups = props.groups || [];

      return groups.map(function(group) {
        var usergroup = _.find(usergroups, { GroupId: group.id }) || {};
        return _.extend(group, { role: usergroup.role });
      });
    });
  };

  var updatePaypalEmail = function(req, res, next) {
    var required = req.required || {};

    req.user.paypalEmail = required.paypalEmail;

    req.user.save()
    .then(function(user) {
      res.send(user.info);
    })
    .catch(next);
  };

  var updateAvatar = function(req, res, next) {
    var required = req.required || {};

    req.user.avatar = required.avatar;

    req.user.save()
    .then(function(user) {
      res.send(user.info);
    })
    .catch(next);
  };

  /**
   * Update.
   */
  var update = function(req, res, next) {
    ['name',
     'username',
     'avatar',
     'email',
     'twitterHandle',
     'website',
     'paypalEmail'
     ].forEach(function(prop) {
      if (req.required.user[prop])
        req.user[prop] = req.required.user[prop];
    });
    req.user.updatedAt = new Date();

    req.user
      .save()
      .then(function(user) {
        res.send(user.info);
      })
      .catch(next);
  }

  var getBalancePromise = function(GroupId) {
    return new Bluebird(function(resolve, reject) {
      groups.getBalance(GroupId, function(err, balance) {
        return err ? reject(err) : resolve(balance);
      });
    });
  };

  /**
   * Public methods.
   */
  return {

    /**
     * Create a user.
     */
    create: function(req, res, next) {
      var user = req.required.user;
      user.ApplicationId = req.application.id;

      User
        .create(user)
        .then(function(user) {
          res.send(user.info);

          Activity.create({
            type: 'user.created',
            UserId: user.id,
            data: {user: user.info}
          });
        })
        .catch(next);
    },

    /**
     * Get token.
     */
    getToken: function(req, res, next) {
      res.send({
        access_token: req.user.jwt(req.application),
        refresh_token: req.user.refresh_token
      });
    },

    /**
     * Show.
     */
    show: function(req, res) {
      if (req.remoteUser.id === req.user.id)
        res.send(req.user.info);
      else
        res.send(req.user.show);
    },

    /**
     * Get a user's groups.
     */
    getGroups: function(req, res, next) {
      // Follows json api spec http://jsonapi.org/format/#fetching-includes
      var include = req.query.include;
      var withRoles = _.contains(include, 'usergroup.role');
      var options = {
        include: []
      };

      if (_.contains(include, 'activities')) {
        options.include.push({ model: Activity });
      }

      if (_.contains(include, 'stripemanagedaccount')) {
        options.include.push({ model: StripeManagedAccount });
      }

      var promise = withRoles ?
        getGroupsFromUserWithRoles(req, options) :
        getGroupsFromUser(req, options);

      promise.map(function(group) {
        return getBalancePromise(group.id)
        .then(function(balance) {
          return _.extend(group, { balance: balance });
        });
      })
      .then(function(out) {
        res.send(out);
      })
      .catch(next);
    },

    updatePaypalEmail: updatePaypalEmail,
    updateAvatar: updateAvatar,
    update: update
  };

};
