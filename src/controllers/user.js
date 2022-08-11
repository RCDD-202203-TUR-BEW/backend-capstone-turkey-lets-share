/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const UserModel = require('../models/user');
const PostModel = require('../models/post');

// eslint-disable-next-line consistent-return
const getProfile = async (req, res) => {
  try {
    if (req.user) {
      const currentUser = await UserModel.findByuserId(req.user.useruserId);
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
            postStatus: 'Published',
          });

        } else if (type === 'received') {
          filterQueries.$or.push({
            beneficiary: req.params.userId,
            postStatus: 'Verified',
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
      const userPosts = await PostModel.find({
        $or: [{ donor: req.params.userId }, { beneficiary: req.params.userId }],
      });

      return res.json(userPosts);
    }

    const userPosts = await PostModel.find(filter);
    return res.json(userPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  getUserPosts,
};
