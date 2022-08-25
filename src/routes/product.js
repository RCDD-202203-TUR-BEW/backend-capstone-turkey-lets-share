const Multer = require('multer');
const express = require('express');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

const router = express.Router();

router.post(
  '/',
  multer.array('photos', 10),
  productMiddleware,
  productController.addNewProduct
);
router.get('/:productId', productController.getSingleProduct);
router.get('/', productController.getProducts);
router.delete('/:productId', productController.deleteProduct);
router.patch('/:productId', productController.updateProduct);
router.post('/:productId/request', productController.orderRequest);
router.get('/:productId/requesters', productController.getRequesters);

module.exports = router;
