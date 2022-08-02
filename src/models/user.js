const mongoose = require('mongoose');
const constants = require('../lib/constants');

const objectId = mongoose.Schema.Types.ObjectId;

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address0: {
    type: String,
    required: true,
    maxLength: 100,
  },
  address1: {
    type: String,
    required: false,
    maxLength: 100,
  },
  zip: {
    type: String,
    required: false,
    match: [
      /^\d{5}(?:[-\s]\d{4})?$/,
      `Zip code must be in the format 12345 or 12345-1234`,
    ],
  },
  description: {
    type: String,
    required: false,
    maxLength: 200,
  },
});

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: {
      ref: 'User',
      type: objectId,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      ref: 'User',
      type: objectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: constants.ENUM_REPORT_STATUS,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: false,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    nationality: {
      type: String,
      required: false,
    },
    refugee: {
      type: Boolean,
      required: false,
    },
    avaregeRating: {
      type: Number,
      required: true,
      default: 0,
    },
    profilePhoto: {
      type: String,
      required: true,
      default:
        'https://cdn.dribbble.com/users/6142/screenshots/5679189/media/052967c305a8f96a4b40b79ce5e61b0d.png',
      // source: https://dribbble.com/shots/5679189-Default-Profile-Image
    },
    donated: {
      ref: 'Donation',
      type: [objectId],
      required: true,
      default: [],
    },
    requested: {
      ref: 'Request',
      type: [objectId],
      required: true,
      default: [],
    },
    received: {
      ref: 'Request',
      type: [objectId],
      required: true,
      default: [],
    },
    provider: {
      type: String,
      required: true,
      enum: constants.ENUM_PROVIDER,
    },
    providerId: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    address: {
      type: [addressSchema],
      required: true,
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      required: true,
      default: [],
    },
    reports: {
      type: [reportSchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
