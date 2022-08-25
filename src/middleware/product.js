/* eslint-disable consistent-return */
const constants = require('../lib/constants');

const productMiddleware = async (req, res, next) => {
  const errorsArray = [];
  const { title, description, category, location } = req.body;

  if (!constants.EMPTY_PRODUCT_REGEX.test(title)) {
    errorsArray.push('Title is required');
  }
  if (!constants.EMPTY_PRODUCT_REGEX.test(description)) {
    errorsArray.push('You have to add a description');
  }
  if (!constants.EMPTY_PRODUCT_REGEX.test(category)) {
    errorsArray.push('You have to choose a category');
  }
  if (!constants.EMPTY_PRODUCT_REGEX.test(location)) {
    errorsArray.push('You have to add a location');
  }

  if (errorsArray.length > 0) {
    return res.status(400).json({ error: errorsArray });
  }
  await next();
};

module.exports = { productMiddleware };
