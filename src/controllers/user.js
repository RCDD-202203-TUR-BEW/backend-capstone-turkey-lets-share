/* eslint-disable prettier/prettier */
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

// eslint-disable-next-line consistent-return
const getProfile = async (req, res) => {
  try {
    if (req.user) {
      const currentUser = await UserModel.findById(req.user.userId);
      return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .json(currentUser);
    }
  } catch (error) {
    return res.sendStatus(500).json({ message: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const foundUser = await UserModel.findById(req.params.id);
    if (foundUser) {
      if (req.user.userId === foundUser.id) {
        return res.status(200).json({ message: 'Redirecting to profile...' });
      }

      const shownInfo = { ...foundUser, passwordHash: undefined };
      return res.status(200).json(shownInfo);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
const updateUser = async (req, res) => {
  const bodyParams = Object.keys(req.body); // ['name', 'email', 'password']
  const restrictedParams = [
    '_id',
    'email',
    'provider',
    'donated',
    'requested',
    'received',
  ];
  try {
    const foundUser = await UserModel.findById(req.params.id);
    if (foundUser) {
      if (req.user.userId === String(foundUser.id)) {
        if (req.body.password) {
          const passwordHash = await bcrypt.hash(req.body.password, 10);
          foundUser.passwordHash = passwordHash;
        }

        // eslint-disable-next-line consistent-return
        bodyParams.forEach((param) => {
          if (restrictedParams.includes(param)) {
            return res
              .status(400)
              .json({ message: `Cannot update field ${param}` });
          }
          foundUser[param] = req.body[param];
        });

        await foundUser.save();
        return res.status(200).json({ message: 'User updated' });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  getSingleUser,
  updateUser,
};
