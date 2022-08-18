const express = require('express');
const authController = require('../controllers/auth');
const { passport } = require('../config/passport');
const {
  userLoginValidationRules,
  errorHandlingForValidation,
  registerMiddleware,
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerMiddleware, authController.register);

router.post(
  '/login',
  userLoginValidationRules,
  errorHandlingForValidation,
  authController.login
);

router.post('/logout', authController.logout);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google',
    session: false,
  }),
  authController.saveUserToTokenAndCookie
);

router.get(
  '/facebook',
  passport.authorize('facebook', { scope: ['email'] }),
  passport.authenticate('facebook')
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/api/auth/facebook',
  }),
  authController.saveUserToTokenAndCookie
);

module.exports = router;
