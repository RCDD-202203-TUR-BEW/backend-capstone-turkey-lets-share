/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const constants = require('../lib/constants');

const userLoginValidationRules = [
  body('usernameOrEmail')
    .exists({ checkFalsy: true })
    .withMessage('Please enter your username or email'),
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password cannot be empty!'),
];

const errorHandlingForValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  return next();
};

const registerMiddleware = async (req, res, next) => {
  try {
    const errorsArray = [];
    const { firstName, lastName, email, phoneNumber, password0, password1 } =
      req.body;

    if (password0 !== password1) {
      errorsArray.push('Password fields do not match');
    }

    if (!constants.PASSWORD_REGEX.test(password0)) {
      errorsArray.push(constants.PASSWORD_ERROR);
    }

    if (
      constants.NAME_REGEX.test(firstName) ||
      constants.NAME_REGEX.test(lastName)
    ) {
      errorsArray.push('Name fields can not be empty');
    }

    if (!constants.EMAIL_REGEX.test(email)) {
      errorsArray.push('Invalid email format');
    }

    if (!constants.PHONE_NUMBER_REGEX.test(phoneNumber)) {
      errorsArray.push(constants.PHONE_NUMBER_ERROR);
    }

    if (errorsArray.length > 0) {
      return res.status(400).json({ error: errorsArray });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }

  await next();
};

module.exports = {
  userLoginValidationRules,
  errorHandlingForValidation,
  registerMiddleware,
};
