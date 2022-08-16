const bcrypt = require('bcrypt');
const constants = require('../lib/constants');
const UserModel = require('../models/user');

// eslint-disable-next-line consistent-return
const validateUpdate = (req, res, next) => {
  const {
    password,
    passwordConfirmation,
    address,
    age,
    phoneNumber,
    username,
  } = req.body;
  const errorsArray = [];
  if (username) {
    if (!constants.USERNAME_REGEX.test(username)) {
      errorsArray.push(constants.USERNAME_ERROR);
    }
  }
  if (phoneNumber) {
    if (!constants.PHONE_NUMBER_REGEX.test(phoneNumber)) {
      errorsArray.push(constants.PHONE_NUMBER_ERROR);
    }
  }
  if (address) {
    const requiredFeilds = ['country', 'city', 'address0', 'address1', 'zip'];
    if (typeof address !== 'object') {
      errorsArray.push('Address is not an object');
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const field of requiredFeilds) {
      if (!address[field]) {
        errorsArray.push(`${field} is required in Address`);
      }
    }
  }
  if (age) {
    if (!constants.AGE_REGEX.test(age)) {
      errorsArray.push('Age is not a number');
    }
  }
  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  next();
};

// eslint-disable-next-line consistent-return
const validatePassword = async (req, res, next) => {
  const { oldPassword, password, passwordConfirmation } = req.body;
  const errorsArray = [];
  const User = await UserModel.findById(req.user.userId);
  if (!oldPassword || !password || !passwordConfirmation) {
    errorsArray.push('Password feilds are required');
  } else {
    if (User) {
      const passwordMatch = await bcrypt.compare(
        req.body.oldPassword,
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
