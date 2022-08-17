const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/', productController.getProducts);

router.post('/', productMiddleware, productController.addNewProduct);

module.exports = router;
