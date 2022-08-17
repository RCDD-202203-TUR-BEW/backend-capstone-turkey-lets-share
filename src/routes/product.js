const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const router = express.Router();


const productController = require('../controllers/product');


router.post('/', productMiddleware, productController.addNewProduct);

router.patch('/:productId', productController.updateProduct);

module.exports = router;
