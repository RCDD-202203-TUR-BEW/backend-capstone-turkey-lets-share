const constants = require('../lib/constants');

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
  const properties = Object.keys(req.body);
  const emptyOrWhitespace = /^$|\s+/;
  // eslint-disable-next-line consistent-return
  properties.forEach((property) => {
    if (emptyOrWhitespace.test(req.body[property])) {
      errorsArray.push(`${property} Cannot be empty`);
    }
  });
  if (password) {
    if (!passwordConfirmation) {
      errorsArray.push('Password feilds are required');
    }
    if (password !== passwordConfirmation) {
      errorsArray.push('Passwords do not match');
    }
    if (!constants.PASSWORD_REGEX.test(password)) {
      errorsArray.push(constants.PASSWORD_ERROR);
    }
  }
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

module.exports = {
  validateUpdate,
};
