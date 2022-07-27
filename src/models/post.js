const mongoose = require('mongoose');
const constants = require('../lib/constants');

const objectId = mongoose.Schema.Types.ObjectId;

const orderRequestSchema = new mongoose.Schema(
  {
    requestUser: {
      ref: 'User',
      type: objectId,
    },
    requestDescription: {
      type: String,
      maxLength: 400,
      required: true,
    },
    requestStatus: {
      type: String,
      enum: constants.ENUM_REQUEST_STATUS,
      default: 'Requested',
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 75,
      required: true,
    },
    description: {
      type: String,
      maxLength: 400,
      required: true,
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
    postStatus: {
      type: String,
      enum: constants.ENUM_POST_STATUS,
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
      type: [orderRequestSchema],
      maxLength: 5,
    },
    isEvent: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
