/* eslint-disable prettier/prettier */
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
      if (req.user?.userId === foundUser.id) {
        return res.status(200).json({ message: 'Redirecting to profile...' });
      }

      const shownInfo = { ...foundUser._doc, passwordHash: null };
      return res.status(200).json(shownInfo);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  getSingleUser,
};
