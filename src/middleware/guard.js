const { expressjwt: jwt } = require('express-jwt');
const constants = require('../lib/constants');

const { PUBLIC_AUTH_ROUTES, PUBLIC_ROUTES } = constants;

const allPublicPaths = PUBLIC_ROUTES.concat(PUBLIC_AUTH_ROUTES);

const authenticationMiddleware = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
  getToken: (req) => req.signedCookies.token ?? req.cookies.token,
  requestProperty: 'user',
}).unless({
  path: allPublicPaths,
});

module.exports = { authenticationMiddleware };
