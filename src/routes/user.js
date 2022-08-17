const express = require('express');
const userController = require('../controllers/user');
const {
  validateUpdate,
  validatePassword,
} = require('../middleware/updateValidation');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:id', userController.getSingleUser);
router.get('/:userId/products', userController.getUserProducts);
router.patch('/profile/update', validateUpdate, userController.updateUser);
router.patch(
  '/profile/update/password',
  validatePassword,
  userController.updatePassword
);

module.exports = router;
