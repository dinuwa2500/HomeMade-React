import express from 'express';
import {
  AddProductReview,
  CreateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
} from '../controllers/product.controller.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new product (with authentication and file upload middleware)
// The 'array' method accepts multiple files with the field name 'images'
router.post('/add', auth, upload.array('images', 5), CreateProduct);
router.get('/all-products', auth, GetAllProducts);
router.get('/', GetAllProducts);
// Public route: get product by id (for product details page)
router.get('/:id', GetProductById);
// Add review to a product (requires authentication)
router.post('/:id/reviews', auth, AddProductReview);
router.put('/update/:id', auth, upload.array('images', 5), UpdateProduct);
router.delete('/delete/:id', auth, DeleteProduct);

export default router;
