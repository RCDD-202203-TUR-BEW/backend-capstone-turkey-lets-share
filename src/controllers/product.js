/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
const objectId = require('mongoose').Types.ObjectId;
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

// eslint-disable-next-line consistent-return
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
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = {
  addNewProduct,
  getProducts,
};
