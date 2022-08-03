const jwt = require('jsonwebtoken');

const config = process.env;
const PUBLIC_AUTH_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/google/callback',
  '/api/auth/facebook',
  '/api/auth/facebook/callback',
];

const PRIVATE_ROUTES = ['/api/auth/profile', '/api/auth/logout'];

function authorize(redirectPath = '/api/auth/login') {
  return async (req, res, next) => {
    const token = req.signedCookies['auth-token'];
    if (!token) {
      if (PUBLIC_AUTH_ROUTES.includes(req.path)) {
        return next();
      }
      if (PRIVATE_ROUTES.includes(req.path)) {
        return res.status(401).json({ message: 'You are not authorized' });
      }
      if (req.path === '/api/post' && req.method === 'POST') {
        return res
          .status(401)
          .json({ message: 'Not Authorized to do this saction' });
      }
      if (
        req.path === '/api/post/:id' &&
        (req.method === 'PUT' || req.method === 'DELETE')
      ) {
        return res
          .status(401)
          .json({ message: 'You are not authorized to perform this action' });
      }
    } else {
      try {
        const user = jwt.verify(token, config.SECRET_KEY);
        req.user = user;
        if (PUBLIC_AUTH_ROUTES.includes(req.path)) {
          return res.status(403).json({ message: 'Already Logged in' });
        }
      } catch (err) {
        res
          .status(401)
          .json({ message: 'You are not authorized to perform this action' });
      }
    }
    return next();
  };
}

module.exports = authorize;
