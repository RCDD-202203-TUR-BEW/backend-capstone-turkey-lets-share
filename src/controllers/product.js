/* eslint-disable no-underscore-dangle */
const _ = require('lodash');

const ProductModel = require('../models/product');

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

    const validKeys = [
      'title',
      'description',
      'photos',
      'category',
      'location',
      'productCondition',
      'shippingOptions',
      'postType',
    ];

    const updatedProduct = _.pick(req.body, validKeys);
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
  updateProduct,
};
