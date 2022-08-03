const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const constants = require('../lib/constants');

const saveUserToTokenAndCookie = (req, res) => {
  const { name, email, providerId, profilePicture } = req.user;
  const payload = {
    name,
    email,
    providerId,
    avatar: profilePicture,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: constants.TOKEN_EXPIRATION_DURATION[0],
  });
  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    maxAge: constants.COOKIE_MAX_AGE,
  });
  res.redirect('/api/user/profile');
};

module.exports = {
  saveUserToTokenAndCookie,
};
