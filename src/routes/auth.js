const express = require('express');
const { registerMiddleware } = require('../middleware/auth');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', registerMiddleware, authController.register);

// router.post('/logout', authController.logout);

module.exports = router;
