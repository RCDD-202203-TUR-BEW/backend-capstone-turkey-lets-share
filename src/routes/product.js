const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const router = express.Router();

router.post('/', productMiddleware, productController.createProduct);

module.exports = router;
