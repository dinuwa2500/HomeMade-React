import express from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create category
router.post('/', auth, createCategory);
// Get all categories
router.get('/', getAllCategories);
// Update category
router.put('/:id', auth, updateCategory);
// Delete category
router.delete('/:id', auth, deleteCategory);

export default router;
