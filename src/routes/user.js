const express = require('express');
const userController = require('../controllers/user');
const { validateUpdate } = require('../middleware/updateValidation');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:id', userController.getSingleUser);
router.patch('/:id', validateUpdate, userController.updateUser);
module.exports = router;
