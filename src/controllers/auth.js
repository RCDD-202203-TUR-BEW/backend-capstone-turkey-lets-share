const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const saveUserToTokenAndCookie = (req, res) => {
  const { name, email, providerId, profilePicture } = req.user;
  const payload = {
    name,
    email,
    providerId,
    avatar: profilePicture,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 14,
  });

  res.redirect('/');
};

module.exports = {
  saveUserToTokenAndCookie,
};
