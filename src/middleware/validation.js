const { body, validationResult } = require('express-validator');

const userLoginValidationRules = [
  body('email')
    .exists()
    .withMessage('Email cannot be empty!')
    .isEmail()
    .withMessage('Email format is not correct!'),
  body('password').exists().withMessage('Password cannot be empty!'),
];

const errorHandlingForValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

module.exports = { userLoginValidationRules, errorHandlingForValidation };
