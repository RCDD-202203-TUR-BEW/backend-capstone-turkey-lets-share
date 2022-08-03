const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { generateUniqeUsername } = require('../services/utils');

// eslint-disable-next-line consistent-return
const register = async (req, res) => {
  const errorsArray = [];
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
      errorsArray.push('Email is already taken');
    }

    if (errorsArray.length > 0) {
      return res.status(400).json({ error: errorsArray });
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

    console.log(newUser);

    return res.status(201).json({ created: newUser });
    // return res.status(201).redirect('/api/auth/login');
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
