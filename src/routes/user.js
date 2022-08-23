const express = require('express');
const userController = require('../controllers/user');
const {
  validateUpdate,
  validatePassword,
  validateAddress,
} = require('../middleware/updateValidation');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:id', userController.getSingleUser);
router.get('/:userId/products', userController.getUserProducts);
router.delete('/profile/delete', userController.deleteProfile);
router.patch('/profile/update', validateUpdate, userController.updateUser);
router.patch(
  '/profile/update/password',
  validatePassword,
  userController.updatePassword
);
router.patch(
  '/profile/update/address/:operation/:addressID?',
  validateAddress,
  userController.updateAddress
);

module.exports = router;
