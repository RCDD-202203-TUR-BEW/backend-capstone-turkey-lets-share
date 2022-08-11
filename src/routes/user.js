const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:userId/posts', userController.getUserPosts);

module.exports = router;
