const mongoose = require('mongoose');
const constants = require('../lib/constants');

const objectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 75,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 400,
      required: true,
      trim: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: constants.ENUM_CATEGORY,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    productCondition: {
      type: String,
      enum: constants.ENUM_PRODUCT_CONDITION,
      required: true,
    },
    shippingOptions: {
      type: String,
      enum: constants.ENUM_SHIPPING_OPTION,
      required: true,
    },
    postType: {
      type: String,
      enum: constants.ENUM_POST_TYPE,
      required: true,
    },
    isTransactionCompleted: {
      type: Boolean,
    },
    publisher: {
      ref: 'User',
      type: objectId,
    },
    donor: {
      ref: 'User',
      type: objectId,
    },
    beneficiary: {
      ref: 'User',
      type: objectId,
    },
    orderRequests: {
      ref: 'User',
      type: [objectId],
      default: [],
      maxLength: 5,
    },
    isEvent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
