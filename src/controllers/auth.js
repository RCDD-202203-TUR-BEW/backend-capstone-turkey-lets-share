const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
// const constants = require('../lib/constants');
const { registerMiddleware } = require('../middleware/auth');

// eslint-disable-next-line consistent-return
const register = async (req, res) => {
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
  } = req.body;

  registerMiddleware(req, res);

  try {
    const usedUsername = await UserModel.findOne({ username });
    if (!usedUsername) {
      const usedEmail = await UserModel.findOne({ email });
      if (!usedEmail) {
        const usedPhoneNumber = await UserModel.findOne({ phoneNumber });

        if (!usedPhoneNumber) {
          const passwordHash = await bcrypt.hash(password0, 10);

          await UserModel.create({
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

          return res.status(200).redirect('/api/auth/login');
        }
        return res.status(401).send({ error: 'Phone number already exists' });
      }
      return res.status(401).send({ error: 'Email already exists' });
    }
    return res.status(401).send({ error: 'Username already exists' });
  } catch (err) {
    res.status(500).send(err);
  }
};

// const logout = async (req, res) => {};

module.exports = {
  register,
  // logout,
};
