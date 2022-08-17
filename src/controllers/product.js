/* eslint-disable no-underscore-dangle */
const objectId = require('mongoose').Types.ObjectId;
const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const _ = require('lodash');

const addNewProduct = async (req, res) => {
  try {
    const newProduct = await ProductModel.create({
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

    if (newProduct.postType === 'Donate') {
      await UserModel.findByIdAndUpdate(req.user.userId, {
        $push: { donated: newProduct._id },
      });
    }
    if (newProduct.postType === 'Request') {
      newProduct.donor = null;
      newProduct.beneficiary = objectId(req.user.userId);
      await newProduct.save();

      await UserModel.findByIdAndUpdate(req.user.userId, {
        $push: { requested: newProduct._id },
      });
    }

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const orderRequest = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.publisher.toString() === req.user.userId.toString()) {
      return res
        .status(400)
        .json({ message: 'You cannot make request to your own product' });
    }
    if (product.isTransactionCompleted === true) {
      return res
        .status(400)
        .json({ message: 'This product is no longer available' });
    }
    if (product.orderRequests.includes(req.user.userId)) {
      return res
        .status(400)
        .json({ message: 'You have already made a request for this product' });
    }
    if (product.postType === 'Request') {
      return res
        .status(400)
        .json({ message: 'This product is not available for donation' });
    }
    if (product.orderRequests.length >= 5) {
      return res.status(400).json({
        message: 'This product has reached the maximum number of requests',
      });
    }
    product.orderRequests.push(req.user.userId);
    await product.save();

    const user = await UserModel.findById(req.user.userId);
    user.requested.push(product._id);
    await user.save();

    const response = {
      message: 'Your request is succesfully saved for this product',
      product: _.omit(product.toObject(), ['orderRequests']),
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNewProduct,
  orderRequest,
};
