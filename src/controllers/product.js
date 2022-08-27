/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const objectId = require('mongoose').Types.ObjectId;
const constants = require('../lib/constants');
const storage = require('../config/storage');
const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const { sendProductRequestEmail } = require('../services/mail');

const getFileExtension = (fileName) =>
  fileName.slice(fileName.lastIndexOf('.') + 1);

const testMulter = async (req, res) => {
  console.log('photos has been uploaded', req.files);
  // eslint-disable-next-line no-restricted-syntax
  (async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of req.files) {
      console.log(file.filename);
      // eslint-disable-next-line no-await-in-loop
      const imgUrl = await storage.uploadImage(
        file,
        `product-photos/${new Date().valueOf()}.${file.originalname}`
      );
      console.log('imgUrl', imgUrl);
      console.log('image uploaded');
    }
  })();

  return res.status(200).json({ message: 'Photos has been uploaded' });
};

const addNewProduct = async (req, res) => {
  try {
    const newProduct = await ProductModel.create({
      title: req.body.title,
      description: req.body.description,
      // photos: req.body.photos,
      category: req.body.category,
      location: req.body.location,
      publisher: req.user.userId,
      donor: req.user.userId,
      beneficiary: null,
    });

    if (req.files) {
      console.log('files:', req.files);
      // eslint-disable-next-line no-restricted-syntax
      for (const file of req.files) {
        console.log(file.filename);
        // eslint-disable-next-line no-await-in-loop
        const imgUrl = await storage.uploadImage(
          file,
          `product-photos/${new Date().valueOf()}.${file.originalname}`
        );
        newProduct.photos.push(imgUrl);
        console.log('imgUrl', imgUrl);
        console.log('image uploaded');
      }
      await newProduct.save();

      //   console.log('helllloo', req.files);
      //   const imgUrl = await storage.uploadImage(
      //     req.files,
      //     `photos/${newProduct.id}.${new Date().valueOf()}
      //     .${getFileExtension(req.files.originalname)}`
      //   );
      //   newProduct.photos.push(imgUrl);
      //   await newProduct.save();
    }

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

const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'No Product found!' });
    }
    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    const owner = await UserModel.findById(product.publisher);

    if (
      !constants.PHONE_NUMBER_REGEX.test(user.phoneNumber) ||
      !user.phoneNumber
    ) {
      await sendProductRequestEmail(
        user.username,
        user.email,
        user._id,
        owner.username,
        owner.email,
        product.title,
        product._id
      );
    } else {
      await sendProductRequestEmail(
        user.username,
        user.email,
        user._id,
        owner.username,
        owner.email,
        product.title,
        product._id,
        user.phoneNumber
      );
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRequesters = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.productId).populate(
      'orderRequests',
      'firstName lastName username email phoneNumber'
    );
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    if (String(product.publisher) !== req.user.userId) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action',
      });
    }

    if (product.postType !== 'Donate') {
      return res.status(400).json({
        message: 'This is not a donation product: no requesters',
      });
    }

    if (product.orderRequests.length === 0) {
      return res.status(400).json({
        message: 'No requesters found for this product',
      });
    }

    const requesters = {
      ID: product._id,
      Title: product.title,
      Requesters: product.orderRequests,
    };
    return res.status(200).json(requesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  testMulter,
  addNewProduct,
  getSingleProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  orderRequest,
  getRequesters,
};
