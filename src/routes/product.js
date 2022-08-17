const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const router = express.Router();

router.post('/', productMiddleware, productController.addNewProduct);
router.delete('/:productId', productController.deleteProduct);
router.patch('/:productId', productController.updateProduct);

module.exports = router;
