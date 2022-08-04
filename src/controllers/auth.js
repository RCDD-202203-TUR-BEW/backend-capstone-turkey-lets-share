const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { generateUniqeUsername } = require('../services/utils');

// eslint-disable-next-line consistent-return
const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    age,
    gender,
    nationality,
    refugee,
    password0,
  } = req.body;

  try {
    const usedEmail = await UserModel.findOne({ email });
    if (usedEmail) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    const passwordHash = await bcrypt.hash(password0, 10);
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      username: generateUniqeUsername(email),
      phoneNumber,
      age,
      gender,
      nationality,
      refugee,
      provider: 'Local',
      providerId: 'Local',
      passwordHash,
    });

    const shownUser = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username,
      phoneNumber: newUser.phoneNumber,
    };

    return res.status(201).json(shownUser);
  } catch (err) {
    return res.status(500).send(err);
  }
};

// eslint-disable-next-line arrow-body-style
const logout = async (req, res) => {
  await res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  logout,
};
