const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/', productController.getProducts);

router.post('/', productMiddleware, productController.addNewProduct);
router.delete('/:productId', productController.deleteProduct);
router.patch('/:productId', productController.updateProduct);
router.get('/:productId', productController.getSingleProduct);
router.post(
  '/:productId/requesters/:requesterId/approve',
  productController.approveProduct
);
module.exports = router;
