/* eslint-disable no-underscore-dangle */
const objectId = require('mongoose').Types.ObjectId;
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

const createProduct = async (req, res) => {
  try {
    const newPost = await ProductModel.create({
      title: req.body.title,
      description: req.body.description,
      photos: req.body.photos,
      category: req.body.category,
      location: req.body.location,
      productCondition: req.body.productCondition,
      shippingOptions: req.body.shippingOptions,
      postType: req.body.postType,
      donor: req.user.userId,
      beneficiary: null,
      isEvent: req.body.isEvent,
    });

    if (newPost.postType === 'Donate') {
      await UserModel.findByIdAndUpdate(req.user.userId, {
        $push: { donated: newPost._id },
      });
    }
    if (newPost.postType === 'Request') {
      newPost.donor = null;
      newPost.beneficiary = objectId(req.user.userId);
      await newPost.save();

      await UserModel.findByIdAndUpdate(req.user.userId, {
        $push: { requested: newPost._id },
      });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
};
