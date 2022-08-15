/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const constants = require('../lib/constants');

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

const getUserProducts = async (req, res) => {
  try {
    let { postType, SearchTitles } = req.query;
    const filteringQueries = { $or: [] };
    const finalQuery = { $and: [] };

    if (postType) {
      if (!Array.isArray(postType)) postType = postType.split();

      postType.forEach((type) => {
        filteringQueries.$or.push({
          publisher: req.params.userId,
          ...constants.POST_TYPE_SELECTOR[type]
        });
      });

      if (filteringQueries.$or.length !== 0) {
        finalQuery.$and.push(filteringQueries);
      }

      if (SearchTitles) {
        finalQuery.$and.push({
          title: { $regex: SearchTitles, $options: 'i' },
        });
      }
    }

    if (finalQuery.$and.length === 0) {
      const userPosts = await ProductModel.find({
        publisher: req.params.userId,
      });

      if (userPosts.length === 0) {
        return res.status(400).json({ message: 'Your search was not found!' });
      }
      return res.status(200).json(userPosts);
    }

    const userPosts = await ProductModel.find(finalQuery);
    if (userPosts.length === 0) {
      return res.status(400).json({ message: 'Your search was not found!' });
    }
    return res.status(200).json(userPosts);

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
  getUserProducts,
  getSingleUser,
};
