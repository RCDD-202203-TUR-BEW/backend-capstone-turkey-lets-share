const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:id', userController.getSingleUser);

module.exports = router;
