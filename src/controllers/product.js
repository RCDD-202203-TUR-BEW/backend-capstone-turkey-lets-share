/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const constants = require('../lib/constants');

const objectId = require('mongoose').Types.ObjectId;

const UserModel = require('../models/user');
const ProductModel = require('../models/product');

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


const updateProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    if (product.publisher.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to update this product',
      });
    }

    if (product.isTransactionCompleted) {
      return res.status(400).json({
        message:
          'Transaction is already completed, you cannot update this product',
      });
    }

    const updatedProduct = _.pick(req.body, constants.VALIDPRODUCTKEYS);
    const updatedValidKeys = Object.keys(updatedProduct);
    const requestedKeys = Object.keys(req.body);

    if (updatedValidKeys.toString() !== requestedKeys.toString()) {
      return res.status(422).json({
        message:
          'You entered an invalid key in the body, please check product for valid keys',
      });
    }

    for (let i = 0; i < updatedValidKeys.length; i += 1) {
      const key = updatedValidKeys[i];
      product[key] = updatedProduct[key];
    }
    product.save();
    return res.status(200).json(product);
      } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNewProduct,
  updateProduct
};
