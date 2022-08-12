/* eslint-disable prettier/prettier */
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
      filter.location = { $regex: search, $options: 'i' };
    }

    if (shippingOptions) {
      filter.shippingOptions = shippingOptions;
    }

    if (postType) {
      filter.postType = postType;
    }

    const filteredProducts = await ProductModel.find(filter);

    return res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts };
