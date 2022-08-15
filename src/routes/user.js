const express = require('express');
const userController = require('../controllers/user');
const { validateUpdate } = require('../middleware/updateValidation');
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
module.exports = router;
