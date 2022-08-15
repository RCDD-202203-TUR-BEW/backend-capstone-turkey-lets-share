const express = require('express');

const router = express.Router();

const productController = require('../controllers/product');

router.patch('/:productId', productController.updateProduct);

module.exports = router;
