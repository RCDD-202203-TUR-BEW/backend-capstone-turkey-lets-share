const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const constants = require('../lib/constants');
const { generateUniqeUsername } = require('../services/utils');

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

    const shownInfo = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username,
      phoneNumber: newUser.phoneNumber,
    };

    return res.status(201).json(shownInfo);
  } catch (err) {
    return res.status(500).send(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentUser = await UserModel.findOne({ email });

    if (!currentUser) {
      return res.status(401).json({ message: 'Wrong email or password!' });
    }
    const validPassword = await bcrypt.compare(
      password,
      currentUser.passwordHash
    );
    if (!validPassword) {
      return res.status(401).json({ message: 'Wrong email or password!' });
    }
    // eslint-disable-next-line no-underscore-dangle
    const payload = { userId: currentUser._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: constants.TOKEN_EXPIRATION_DURATION,
    });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: constants.COOKIE_MAX_AGE, // 14 days
    });
    return res.status(201).json({ message: 'User successfully signed in!' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  await res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

const saveUserToTokenAndCookie = (req, res) => {
  const { name, email, providerId, profilePicture } = req.user;
  const payload = {
    name,
    email,
    providerId,
    avatar: profilePicture,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: constants.TOKEN_EXPIRATION_DURATION,
  });
  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    maxAge: constants.COOKIE_MAX_AGE,
  });
  res.redirect('/api/user/profile');
};

module.exports = {
  register,
  login,
  logout,
  saveUserToTokenAndCookie,
};
