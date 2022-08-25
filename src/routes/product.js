const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const router = express.Router();

router.post('/', productMiddleware, productController.addNewProduct);
router.get('/:productId', productController.getSingleProduct);
router.get('/', productController.getProducts);
router.delete('/:productId', productController.deleteProduct);
router.patch('/:productId', productController.updateProduct);
router.post('/:productId/request', productController.orderRequest);
router.get('/:productId/requesters', productController.getRequesters);
router.patch(
  '/:productId/requesters/:requesterId/approve',
  productController.approveRequest
);
module.exports = router;
