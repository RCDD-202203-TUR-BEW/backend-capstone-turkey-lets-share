const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;
    const databaseUser = await UserModel.findOne({ email });

    if (!databaseUser) {
      return res.status(401).json({ message: 'Wrong username or password!' });
    }
    const validPassword = await bcrypt.compare(
      password,
      databaseUser.passwordHash
    );
    if (!validPassword) {
      return res.status(401).json({ message: 'Wrong username or password!' });
    }
    // eslint-disable-next-line no-underscore-dangle
    const payload = { userId: databaseUser._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '14d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });
    return res.status(201).json({ message: 'User sucesfully signed in!' });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

module.exports = {
  loginUsers,
};
