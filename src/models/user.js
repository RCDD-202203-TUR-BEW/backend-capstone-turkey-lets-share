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
      match: [
        /^[a-zA-Z0-9\-_.]+@[a-z]+\.([a-z]{2,3})+(\.[a-z]{2,3})?$/,
        `invalid email`,
      ],
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      match: [
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        /^(?=.{2,40}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        `invalid username`,
      ],
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: Number,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: constants.ENUM_GENDER,
    },
    nationality: {
      type: String,
      enum: constants.ENUM_NATIONALITY,
    },
    refugee: {
      type: Boolean,
    },
    avaregeRating: {
      type: Number,
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
      default: [],
    },
    requested: {
      ref: 'Request',
      type: [objectId],
      default: [],
    },
    received: {
      ref: 'Request',
      type: [objectId],
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
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    reports: {
      type: [reportSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
