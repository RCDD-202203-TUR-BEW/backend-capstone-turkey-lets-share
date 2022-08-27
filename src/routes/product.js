const multer = require('multer');
const express = require('express');
const storage = require('../config/storage');
const { productMiddleware } = require('../middleware/product');
const productController = require('../controllers/product');

const fileStorageEngine = multer.diskStorage({
  storage: multer.memoryStorage(),
  filename: (req, file, cb) => {
    cb(null, `${new Date().valueOf()}.${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorageEngine });

const router = express.Router();

router.post('/test', upload.array('photos', 2), productController.testMulter);

router.post(
  '/',
  productMiddleware,
  upload.array('photos', 2),
  productController.addNewProduct
);
router.get('/:productId', productController.getSingleProduct);
router.get('/', productController.getProducts);
router.delete('/:productId', productController.deleteProduct);
router.patch('/:productId', productController.updateProduct);
router.post('/:productId/request', productController.orderRequest);
router.get('/:productId/requesters', productController.getRequesters);

module.exports = router;
