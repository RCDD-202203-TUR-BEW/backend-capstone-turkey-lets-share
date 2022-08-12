const express = require('express');
const postController = require('../controllers/product');

const router = express.Router();

router.get('/', postController.getProducts);

module.exports = router;
