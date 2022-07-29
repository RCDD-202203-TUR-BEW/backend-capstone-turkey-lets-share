const constants = require('../lib/constants');

const registerMiddleware = async (req, res, next) => {
  const errorsArr = [];
  const {
    firstName,
    lastName,
    email,
    username,
    phoneNumber,
    password0,
    password1,
  } = req.body;

  try {
    if (password0 !== password1) {
      errorsArr.push('Password fields do not match');
    }

    if (!constants.PASSWORD_0_REGEX.test(password0)) {
      errorsArr.push(constants.PASSWORD_0_ERROR);
    }

    if (
      constants.NAME_REGEX.test(firstName) ||
      constants.NAME_REGEX.test(lastName)
    ) {
      errorsArr.push('Name fields can not be empty');
    }

    if (!constants.EMAIL_REGEX.test(email)) {
      errorsArr.push('Invalid email');
    }

    if (!constants.USERNAME_REGEX.test(username)) {
      errorsArr.push(constants.USERNAME_ERROR);
    }

    if (!constants.PHONE_NUMBER_REGEX.test(phoneNumber)) {
      errorsArr.push(constants.PHONE_NUMBER_ERROR);
    }

    if (errorsArr.length > 0) {
      return res.status(401).send({ error: errorsArr });
    }
  } catch (err) {
    res.status(500).send(err);
  }

  return next();
};

module.exports = { registerMiddleware };
