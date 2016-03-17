var config = require('config');
var jwt = require('jsonwebtoken');
var flow = require('middleware-flow');
var errors = require('../../lib/errors');

const Forbidden = errors.Forbidden;
const Unauthorized = errors.Unauthorized;
const secret = config.keys.opencollective.secret;

/**
 * Middleware related to authentication.
 *
 * Identification is provided through two vectors:
 * - api_key URL parameter which uniquely identifies an application
 * - JSON web token JWT payload which contains 3 items:
 *   - aud: application ID which also uniquely identifies an application
 *   - sub: user ID
 *   - scope: user scope (e.g. 'subscriptions')
 *
 * Thus:
 * - an application is identified with either an api_key or a JWT
 * - a user is identified with a JWT
 */
module.exports = function (app) {

  var Controllers = app.get('controllers');
  var mw = Controllers.middlewares;
  var models = app.get('models');
  var Application = models.Application;
  var User = models.User;

  return {

    /**
     * Express-jwt will either force all routes to have auth and throw
     * errors for public routes. Or authorize all the routes and not throw
     * expirations errors. This is a cleaned up version of that code that only
     * decodes the token (expected behaviour).
     */
    parseJwtNoExpiryCheck: (req, res, next) => {
      console.log("parseJwtNoExpiryCheck");
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');

        const scheme = parts[0];
        const token = parts[1];

        if (!/^Bearer$/i.test(scheme) || !token) {
          return next(new Unauthorized('Format is Authorization: Bearer [token]'));
        }

        jwt.verify(token, secret, (err, decoded) => {
          // JWT library either returns an error or the decoded version
          if (err && err.name === 'TokenExpiredError') {
            req.jwtExpired = true;
            req.jwtPayload = jwt.decode(token, secret); // we need to decode again
          } else if (err) {
            return next(new Unauthorized(err.message));
          } else {
            req.jwtPayload = decoded;
          }

          return next();
        });
      } else {
        return next();
      }
    },

    checkJwtExpiry: (req, res, next) => {
      console.log("checkJwtExpiry");
      if (req.jwtExpired) {
        return next(new errors.CustomError(401, 'jwt_expired', 'jwt expired'));
      }

      return next();
    },

    _authenticateAppByJwt: (req, res, next) => {
      console.log("_authenticateAppByJwt");
      const appId = parseInt(req.jwtPayload.aud);

      Application
        .find(appId)
        .then(application => {
          if (application.disabled) {
            throw new Unauthorized();
          }
          req.application = application;
          return next();
        })
        .catch(next);
    },

    //authenticateAppByJwt: [
    //  this.parseJwtNoExpiryCheck,
    //  this.checkJwtExpiry,
    //  this._authenticateAppByJwt
    //],

    authenticateAppByApiKey: (req, res, next) => {
      console.log("authenticateAppByApiKey");
      mw.required('api_key')(req, res, () => {
        console.log("authenticateAppByApiKey level 2");
        const appApiKey = req.query.api_key || req.body.api_key;

        // TODO simplify with promises
        Application.findByKey(appApiKey, function(e, application) {
          if (e) {
            return next(e);
          }

          if (!application) {
            return next(new Unauthorized('Invalid API key: ' + appApiKey));
          }

          if (application.disabled) {
            return next(new Forbidden('Application disabled'));
          }

          req.application = application;
          next();
        });
      });
    },

    /**
     * Authenticate user by username/email/password.
     */
    authenticateUserByName: (req, res, next) => {
      console.log("authenticateUserByName");
      const username = (req.body && req.body.username) || req.query.username;
      const email = (req.body && req.body.email) || req.query.email;
      const password = (req.body && req.body.password) || req.query.password;

      User
        .auth((username || email), password, (e, user) => {
          var errorMsg = 'Invalid username/email or password';

          if (e) {
            if (e.code === 400) {
              return next(new errors.BadRequest(errorMsg));
            }
            else {
              return next(new errors.ServerError(e.message));
            }
          }

          if (!user) {
            return next(new errors.BadRequest(errorMsg));
          }

          req.remoteUser = user;
          req.user = req.remoteUser;

          next();
        });
    },

    authenticateApp:
      flow
        .mwIf(this.authenticateAppByApiKey)
        .else(
          this.parseJwtNoExpiryCheck,
          this.checkJwtExpiry,
          this._authenticateAppByJwt
        )
    ,

    _authenticateUserByJwt: (req, res, next) => {
      console.log("_authenticateUserByJwt");
      User
        .find(req.jwtPayload.sub)
        .then(user => {
          req.remoteUser = user;
          next();
        })
        .catch(next);
    },

    authenticateUser: [
      this.parseJwtNoExpiryCheck,
      this.checkJwtExpiry,
      this._authenticateUserByJwt
    ]
  }
};
