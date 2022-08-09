const express = require('express');
const { registerMiddleware } = require('../middleware/auth');
const authController = require('../controllers/auth');
const { passport } = require('../config/passport');
const {
  userLoginValidationRules,
  errorHandlingForValidation,
} = require('../middleware/validation');

const router = express.Router();

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
router.post(
  '/login',
  userLoginValidationRules,
  errorHandlingForValidation,
  authController.login
);
router.post('/register', registerMiddleware, authController.register);
router.post('/logout', authController.logout);

module.exports = router;
