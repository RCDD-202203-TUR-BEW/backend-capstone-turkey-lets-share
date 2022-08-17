/* eslint-disable no-underscore-dangle */
const objectId = require('mongoose').Types.ObjectId;
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

const addNewProduct = async (req, res) => {
  try {
    const newProduct = await ProductModel.create({
      title: req.body.title,
      description: req.body.description,
      photos: req.body.photos,
      category: req.body.category,
      location: req.body.location,
      productCondition: req.body.productCondition,
      shippingOptions: req.body.shippingOptions,
      postType: req.body.postType,
      publisher: req.user.userId,
      donor: req.user.userId,
      beneficiary: null,
      isEvent: req.body.isEvent,
    });

    if (newProduct.postType === 'Donate') {
      await UserModel.findByIdAndUpdate(req.user.userId, {
        $push: { donated: newProduct._id },
      });
    }
    if (newProduct.postType === 'Request') {
      newProduct.donor = null;
      newProduct.beneficiary = objectId(req.user.userId);
      await newProduct.save();

      await UserModel.findByIdAndUpdate(req.user.userId, {
        $push: { requested: newProduct._id },
      });
    }

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const singleProduct = await ProductModel.findById(req.params.productId);

    if (singleProduct) {
      if (singleProduct.isTransactionCompleted === true) {
        return res.status(400).json({
          message: 'Transaction is completed. You can not delete this post',
        });
      }

      if (String(singleProduct.publisher) === req.user.userId) {
        if (singleProduct.postType === 'Donate') {
          await UserModel.findByIdAndUpdate(req.user.userId, {
            $pull: { donated: singleProduct._id },
          });
        }
        if (singleProduct.postType === 'Request') {
          await UserModel.findByIdAndUpdate(req.user.userId, {
            $pull: { requested: singleProduct._id },
          });
        }
        await singleProduct.deleteOne();
        return res
          .status(200)
          .json({ message: 'Product deleted successfully' });
      }
      return res
        .status(401)
        .json({ message: 'You are not authorized to perform this action' });
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    return res.sendStatus(500).json({ message: error.message });
  }
};

module.exports = {
  addNewProduct,
  deleteProduct,
};
