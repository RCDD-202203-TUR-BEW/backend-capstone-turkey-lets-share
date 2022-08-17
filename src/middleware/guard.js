// const jwt = require('jsonwebtoken');
const { expressjwt: jwt } = require('express-jwt');
const constants = require('../lib/constants');

const config = process.env;

const { PUBLIC_AUTH_ROUTES, PUBLIC_ROUTES, PRIVATE_ROUTES } = constants;

const allPublicPaths = PUBLIC_ROUTES.concat(PUBLIC_AUTH_ROUTES);

function authorize(req, res, next) {
  const { token } = req.signedCookies;
  const route = { method: req.method.toString().toLowerCase(), path: req.path };
  if (!token) {
    if (PUBLIC_AUTH_ROUTES.includes(route) || PUBLIC_ROUTES.includes(route)) {
      return next();
    }
    if (PRIVATE_ROUTES.includes(route)) {
      res.status(401).json({ message: 'You are not authorized' });
    }
  } else {
    try {
      const user = jwt.verify(token, config.SECRET_KEY);
      req.user = user;
      if (PUBLIC_AUTH_ROUTES.includes(route)) {
        res.status(403).json({ message: 'Already Logged in' });
      }
    } catch (err) {
      res
        .status(401)
        .json({ message: 'You are not authorized to perform this action' });
    }
  }
  return next();
}

const authenticationMiddleware = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
  getToken: (req) => req.signedCookies.token ?? req.cookies.token,
  requestProperty: 'user',
}).unless({
  path: allPublicPaths,
});

module.exports = { authorize, authenticationMiddleware };
