const mongoose = require('mongoose');
const constants = require('../lib/constants');

const objectId = mongoose.Schema.Types.ObjectId;

const orderRequestSchema = new mongoose.Schema(
  {
    requestedUser: {
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
      enum: constants.enumRequestStatus,
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
      enum: constants.enumCategory,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    productCondition: {
      type: String,
      enum: constants.enumProductCondition,
      required: true,
    },
    shippingOptions: {
      type: String,
      enum: constants.enumShippingOptions,
      required: true,
    },
    postType: {
      type: String,
      enum: constants.enumPostType,
      required: true,
    },
    postStatus: {
      type: String,
      enum: constants.enumPostStatus,
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
