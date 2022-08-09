/* eslint-disable prettier/prettier */
const PostModel = require('../models/post');

// eslint-disable-next-line consistent-return
const getPosts = async (req, res) => {
  try {
    const {
      search,
      category,
      productCondition,
      location,
      shippingOptions,
      postType,
    } = req.query;

    const filter = { $and: [] };

    if (search) {
      filter.$and.push({
        title: { $regex: search, $options: 'i' },
      });
    }
    if (category) {
      filter.$and.push({ category });
    }

    if (productCondition) {
      filter.$and.push({
        productCondition,
      });
    }
    if (location) {
      filter.$and.push({ location });
    }
    if (shippingOptions) {
      filter.$and.push({ shippingOptions });
    }
    if (postType) {
      filter.$and.push({ postType });
    }
    if (filter.$and.length === 0) {
      const posts = await PostModel.find({});
      return res.status(200).json(posts);
    }
    const filteredPosts = await PostModel.find(filter);
    if (filteredPosts.length === 0) {
      return res.json({ message: 'no post found!!!' });
    }
    return res.status(200).json(filteredPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPosts };
