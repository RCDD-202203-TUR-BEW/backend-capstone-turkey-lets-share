/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const objectId = require('mongoose').Types.ObjectId;
const constants = require('../lib/constants');
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      productCondition,
      location,
      shippingOptions,
      postType,
    } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = { $in: category };
    }

    if (productCondition) {
      filter.productCondition = productCondition;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (shippingOptions) {
      filter.shippingOptions = shippingOptions;
    }

    if (postType) {
      filter.postType = postType;
    }

    const filteredProducts = await ProductModel.find(filter);
    if (filteredProducts.length === 0) {
      return res.status(400).json({ message: 'Your search is not found!' });
    }

    return res.status(200).json(filteredProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
      publisher: req.user.userId,
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

const deleteProduct = async (req, res) => {
  try {
    const singleProduct = await ProductModel.findById(req.params.productId);

    if (singleProduct) {
      if (singleProduct.isTransactionCompleted === true) {
        return res.status(400).json({
          message: 'Transaction is completed. You can not delete this post',
        });
      }

      if (String(singleProduct.publisher) === req.user.userId) {
        if (singleProduct.postType === 'Donate') {
          await UserModel.findByIdAndUpdate(req.user.userId, {
            $pull: { donated: singleProduct._id },
          });
        }
        if (singleProduct.postType === 'Request') {
          await UserModel.findByIdAndUpdate(req.user.userId, {
            $pull: { requested: singleProduct._id },
          });
        }
        await singleProduct.deleteOne();
        return res
          .status(200)
          .json({ message: 'Product deleted successfully' });
      }
      return res
        .status(401)
        .json({ message: 'You are not authorized to perform this action' });
    }
    return res.status(404).json({ message: 'Product not found' });
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

    const updatedProduct = _.pick(req.body, constants.VALID_PRODUCT_KEYS);
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
  getProducts,
  deleteProduct,
  updateProduct,
};
