/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const constants = require('../lib/constants');

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

const updateUser = async (req, res) => {
  const bodyParams = Object.keys(req.body); // ['name', 'email', 'password']
  const allowedParams = constants.VALID_USER_KEYS;
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
  try {
    const { addressID, operation } = req.params;
    const user = await UserModel.findById(req.user.userId);
    let message;
    if (operation === 'add') {
      if (req.body.address !== null && req.body.address !== undefined) {
        user.address.push(req.body.address);
        message = `${req.body.address.title} address has been added successfully`;
      } else {
        return res.status(400).json({ message: 'Address is required' });
      }
    } else if (operation === 'delete' || operation === 'update') {
      if (addressID) {
        const addressIndex = user.address
          .map((address) => address.id)
          .indexOf(addressID);
        if (addressIndex === -1)
          return res.status(404).json({ message: 'Address not found' });
        if (operation === 'update') {
          user.address[addressIndex] = req.body.address;
          message = `${user.address[addressIndex].title} address has been updated successfully`;
        } else if (operation === 'delete') {
          const [deletedAdress] = user.address.splice(addressIndex, 1);
          message = `${deletedAdress.title} address has been deleted successfully`;
        }
      } else {
        return res
          .status(400)
          .json({ message: 'Address ID is required for this operation' });
      }
    }
    await user.save();
    return res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.user.userId);
    await ProductModel.deleteMany({
      publisher: req.user.userId,
      isTransactionCompleted: false,
    });
    await res.clearCookie('token');
    return res.status(200).json({ message: 'User deleted' });
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
  deleteProfile,
};
