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
    // eslint-disable-next-line no-console
    return res.sendStatus(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
};
