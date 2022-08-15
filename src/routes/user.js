const express = require('express');
const userController = require('../controllers/user');
const authorize = require('../middleware/guard');

const router = express.Router();

router.get('/profile', userController.getProfile);
router.get('/:id', userController.getSingleUser);
router.delete('/profile/delete', authorize, userController.deleteProfile);
module.exports = router;
