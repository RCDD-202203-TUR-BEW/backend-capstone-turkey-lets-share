const mongoose = require('mongoose');
const constants = require('../lib/constants');

const objectId = mongoose.Schema.Types.ObjectId;

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  address0: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true,
  },
  address1: {
    type: String,
    required: false,
    maxLength: 100,
    trim: true,
  },
  zip: {
    type: String,
    required: false,
    match: [
      /^\d{5}(?:[-\s]\d{4})?$/,
      `Zip code must be in the format 12345 or 12345-1234`,
    ],
    trim: true,
  },
  description: {
    type: String,
    required: false,
    maxLength: 200,
    trim: true,
  },
});

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
      trim: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      sparse: true,
    },
    age: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: constants.ENUM_GENDER,
    },
    nationality: {
      type: String,
      required: false,
      enum: constants.ENUM_NATIONALITY,
    },
    refugee: {
      type: Boolean,
      required: false,
    },
    profilePhoto: {
      type: String,
      default: constants.DEFAULT_PROFILE_PHOTO,
    },
    donated: {
      ref: 'Product',
      type: [objectId],
      default: [],
    },
    requested: {
      ref: 'Product',
      type: [objectId],
      default: [],
    },
    received: {
      ref: 'Product',
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
