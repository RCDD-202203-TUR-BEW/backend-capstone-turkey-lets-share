const jwt = require('jsonwebtoken');

const config = process.env;
const PUBLIC_AUTH_ROUTES = [
  { method: 'get', path: '/api/auth/login' },
  { method: 'get', path: '/api/auth/register' },
  { method: 'get', path: '/api/auth/google' },
  { method: 'get', path: '/api/auth/google/callback' },
  { method: 'get', path: '/api/auth/facebook' },
  { method: 'get', path: '/api/auth/facebook/callback' },
];

const PUBLIC_ROUTES = [
  { method: 'get', path: '/api/' },
  { method: 'get', path: '/api/about' },
  { method: 'get', path: '/api/posts' },
  { method: 'get', path: '/api/posts' },
  { method: 'get', path: '/api/posts/?filter&&?search' },
  { method: 'get', path: '/api/post/:id' },
];
const PRIVATE_ROUTES = [
  { method: 'post', path: '/api/post' },
  { method: 'put', path: '/api/post/:id' },
  { method: 'delete', path: '/api/post/:id' },
  { method: 'get', path: '/api/auth/profile' },
  { method: 'get', path: '/api/auth/logout' },
];

function authorize(req, res, next) {
  const token = req.signedCookies['auth-token'];
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

module.exports = authorize;
