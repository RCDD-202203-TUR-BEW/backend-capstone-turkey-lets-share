/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

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
    return res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    let { postType } = req.query;
    const { search } = req.query;
    const filter = { $and: [] };
    const filterQueries = { $or: [] };

    if (postType) {
      if (typeof postType !== 'object') postType = postType.split();

      postType.forEach((type) => {

        if (type === 'donated') {
          filterQueries.$or.push({ donor: req.params.userId });

        } else if (type === 'requested') {
          filterQueries.$or.push({
            beneficiary: req.params.userId,
            isTransactionCompleted: false,
          });

        } else if (type === 'received') {
          filterQueries.$or.push({
            beneficiary: req.params.userId,
            isTransactionCompleted: true,
          });
        }
      });

      if (filterQueries.$or.length !== 0) {
        filter.$and.push(filterQueries);
      }
      if (search) {
        filter.$and.push({ title: { $regex: search, $options: 'i' } });
      }
    }

    if (filter.$and.length === 0) {
      const userPosts = await ProductModel.find({
        $or: [{ donor: req.params.userId }, { beneficiary: req.params.userId }],
      });

      return res.json(userPosts);
    }

    const userPosts = await ProductModel.find(filter);
    return res.json(userPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

module.exports = {
  getProfile,
  getUserPosts,
  getSingleUser,
};
