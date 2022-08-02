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
    return res.status(403).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
};
