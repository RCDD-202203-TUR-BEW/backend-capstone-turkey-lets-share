const bcrypt = require('bcrypt');
const constants = require('../lib/constants');
const UserModel = require('../models/user');

// eslint-disable-next-line consistent-return
const validateUpdate = async (req, res, next) => {
  const { age, phoneNumber, username } = req.body;
  const errorsArray = [];
  if (username) {
    const similarUsername = await UserModel.findOne({ username });
    if (similarUsername) {
      errorsArray.push('Username is already taken');
    }
    if (!constants.USERNAME_REGEX.test(username)) {
      errorsArray.push(constants.USERNAME_ERROR);
    }
  }
  if (phoneNumber) {
    const similarPhone = await UserModel.findOne({ phoneNumber });
    if (similarPhone) {
      errorsArray.push('PhoneNumber is already taken');
    }
    if (!constants.PHONE_NUMBER_REGEX.test(phoneNumber)) {
      errorsArray.push(constants.PHONE_NUMBER_ERROR);
    }
  }
  if (age) {
    if (!constants.AGE_REGEX.test(age)) {
      errorsArray.push('Please enter a 2-digit age');
    }
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  next();
};

// eslint-disable-next-line consistent-return
const validatePassword = async (req, res, next) => {
  const { currentPassword, password, passwordConfirmation } = req.body;
  const errorsArray = [];
  const User = await UserModel.findById(req.user.userId);
  if (currentPassword && password && passwordConfirmation) {
    if (User) {
      const passwordMatch = await bcrypt.compare(
        req.body.currentPassword,
        User.passwordHash
      );
      if (!passwordMatch) {
        errorsArray.push('Old password is incorrect');
      }
    }
    if (password !== passwordConfirmation) {
      errorsArray.push('Passwords do not match');
    }
    if (!constants.PASSWORD_REGEX.test(password)) {
      errorsArray.push(constants.PASSWORD_ERROR);
    }
  } else {
    errorsArray.push('Password fields are required');
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  next();
};

module.exports = {
  validateUpdate,
  validatePassword,
};
