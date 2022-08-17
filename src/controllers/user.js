/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const constants = require('../lib/constants');

// eslint-disable-next-line consistent-return
const getProfile = async (req, res) => {
  try {
    if (req.user) {
      const currentUser = await UserModel.findById(req.user.userId);
      return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .json(currentUser);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserProducts = async (req, res) => {
  try {
    let { postType, SearchTitles } = req.query;
    const filteringQueries = { $or: [] };
    const finalQuery = { $and: [] };

    if (postType) {
      if (!Array.isArray(postType)) postType = postType.split();

      postType.forEach((type) => {
        filteringQueries.$or.push({
          publisher: req.params.userId,
          ...constants.POST_TYPE_SELECTOR[type],
        });
      });

      if (filteringQueries.$or.length !== 0) {
        finalQuery.$and.push(filteringQueries);
      }

      if (SearchTitles) {
        finalQuery.$and.push({
          title: { $regex: SearchTitles, $options: 'i' },
        });
      }
    }

    if (finalQuery.$and.length === 0) {
      const userPosts = await ProductModel.find({
        publisher: req.params.userId,
      });

      if (userPosts.length === 0) {
        return res.status(400).json({ message: 'Your search was not found!' });
      }
      return res.status(200).json(userPosts);
    }

    const userPosts = await ProductModel.find(finalQuery);
    if (userPosts.length === 0) {
      return res.status(400).json({ message: 'Your search was not found!' });
    }
    return res.status(200).json(userPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const User = await UserModel.findById(req.params.id);
    if (User) {
      if (req.user?.userId === User.id) {
        return res.status(200).json({ message: 'Redirecting to profile...' });
      }

      const shownInfo = { ...User._doc, passwordHash: null };
      return res.status(200).json(shownInfo);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
const updateUser = async (req, res) => {
  const bodyParams = Object.keys(req.body); // ['name', 'email', 'password']
  const allowedParams = [
    'firstName',
    'lastName',
    'username',
    'phoneNumber',
    'age',
    'gender',
    'nationality',
    'refugee',
    'profilePhoto',
  ];
  const emptyOrWhiteSpace = /^\s*$/;
  try {
    const User = await UserModel.findById(req.user.userId);
    if (User) {
      // eslint-disable-next-line consistent-return
      bodyParams.forEach((param) => {
        if (!emptyOrWhiteSpace.test(req.body[param])) {
          if (!allowedParams.includes(param)) {
            return res
              .status(400)
              .json({ message: `Cannot update field ${param}` });
          }
          User[param] = req.body[param];
        }
      });

      await User.save();
      return res.status(200).json({ message: 'User updated' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
const updatePassword = async (req, res) => {
  try {
    const User = await UserModel.findById(req.user.userId);
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    User.passwordHash = passwordHash;
    await User.save();
    return res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  const User = await UserModel.findOne({ _id: req.user.userId });
  try {
    const { addressID, operation } = req.params;
    const newAddress = req.body.address;
    let message;
    if (addressID && operation) {
      const toUpdateAddress = User.address.filter(
        (address) => String(address._id) === addressID
      );
      const index = User.address.indexOf(toUpdateAddress[0]);
      if (operation === 'update') {
        User.address[index] = newAddress;
        message = `Address ${index + 1} updated`;
      } else if (operation === 'delete') {
        User.address.splice(index, 1);
        message = `Address ${index + 1} deleted`;
      }
    } else {
      User.address.push(newAddress);
      message = `Address added`;
    }
    await User.save();
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  getUserProducts,
  getSingleUser,
  updateUser,
  updatePassword,
  updateAddress,
};
