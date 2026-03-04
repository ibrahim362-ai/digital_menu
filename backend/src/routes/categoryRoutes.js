import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { adminAuth, flexibleAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

router.get('/', flexibleAuth, getCategories);
router.post('/', adminAuth, createCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

export default router;
