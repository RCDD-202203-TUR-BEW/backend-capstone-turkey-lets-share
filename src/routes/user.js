const express = require('express');
const userController = require('../controllers/user');
const {
  validateUpdate,
  validatePassword,
} = require('../middleware/updateValidation');
const authorize = require('../middleware/guard');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:id', userController.getSingleUser);
router.patch(
  '/profile/update',
  authorize,
  validateUpdate,
  userController.updateUser
);
router.patch(
  '/profile/update/password',
  authorize,
  validatePassword,
  userController.updatePassword
);
module.exports = router;
