const express = require('express');
const authController = require('../controllers/auth');
const {
  userLoginValidationRules,
  errorHandlingForValidation,
} = require('../middleware/validation');

const router = express.Router();

router.post(
  '/login',
  userLoginValidationRules,
  errorHandlingForValidation,
  authController.loginUsers
);

module.exports = router;
