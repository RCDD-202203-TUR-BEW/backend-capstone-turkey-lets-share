const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const UserModel = require('../models/user');
// const constants = require('../lib/constants');

// eslint-disable-next-line consistent-return
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      age,
      gender,
      nationality,
      refugee,
      password0,
      password1,
    } = req.body;
    check('password0', 'Password can not be empty.')
      .exists({
        checkFalsy: true,
      })
      .matches(
        /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,}$/
      )
      .withMessage(
        `<ul>
          <li>At least one upper case English letter</li>
          <li>At least one lower case English letter</li>
          <li>At least one number</li>
          <li>At least one special character</li>
          <li>Minimum eight characters</li>
          <li>Can not contain spaces</li>
        </ul>`
      )
      .custom((value) => {
        if (value !== password1) {
          return false;
        }
        return true;
      })
      .withMessage('Passwords are not matching');

    check('firstName', 'Name can not be empty')
      .exists({
        checkFalsy: true,
      })
      .withMessage('Name can not be empty');

    check('lastName', 'Last name can not be empty')
      .exists({
        checkFalsy: true,
      })
      .withMessage('Last name can not be empty');

    check('email')
      .matches(/^[a-zA-Z0-9\-_.]+@[a-z]+\.([a-z]{2,3})+(\.[a-z]{2,3})?$/)
      .withMessage('Invalid email.');

    check('username')
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      .matches(/^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
      .withMessage(
        `<ul>
          <li>Must be between 2 and 20 characters long</li>
          <li>Can only contain letters, numbers, underscores (_), and periods(.)</li>
          <li>Can not start or end with an underscore or a period</li>
        </ul>`
      );

    check('phoneNumber')
      .matches(/^[+]?[0-9]{1,3}[-\s]?[0-9]{1,3}[0-9]{4,9}$/)
      .withMessage(
        `<ul>
          <li>Please include your country code</li>
          <li>Can include a space or dash (-) after country code</li>
          <li>Can be in the format "+90 1234567890" or "901234567890"</li>
        </ul>`
      );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alerts = errors.array();
      return res.send({ error: alerts });
    }

    const usedUsername = await UserModel.findOne({ username });
    if (!usedUsername) {
      const usedEmail = await UserModel.findOne({ email });
      if (!usedEmail) {
        const usedPhoneNumber = await UserModel.findOne({ phoneNumber });
        if (password0 !== password1) {
          return res.send({ error: 'Passwords are not matching' });
        }
        if (!usedPhoneNumber) {
          const passwordHash = await bcrypt.hash(password0, 10);

          const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            username,
            phoneNumber,
            age,
            gender,
            nationality,
            refugee,
            provider: 'Local',
            providerId: 'Local',
            passwordHash,
          });
          const endMessage = `User "${newUser.username}" has been registered successfully`;

          console.log(newUser);
          return res.status(200).send(endMessage);
        }
        return res.status(400).send({ error: 'Phone number already exists' });
      }
      return res.status(400).send({ error: 'Email already exists' });
    }
    return res.status(400).send({ error: 'Username already exists' });
  } catch (err) {
    res.status(500).send(err);
  }
};

// const logout = async (req, res) => {};

module.exports = {
  register,
  // logout,
};
