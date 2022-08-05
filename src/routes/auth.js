const express = require('express');
const authController = require('../controllers/auth');
const {
  userLoginValidationRules,
  errorHandlingForValidation,
} = require('../middleware/validation');

const { passport } = require('../config/passport');

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

module.exports = router;
