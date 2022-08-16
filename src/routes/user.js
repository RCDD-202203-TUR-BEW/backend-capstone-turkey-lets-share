const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/profile', userController.getProfile);

router.get('/:userId/products', userController.getUserProducts);

router.get('/:id', userController.getSingleUser);
router.delete('/profile/delete', userController.deleteProfile);
module.exports = router;
