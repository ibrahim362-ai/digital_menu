import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getMenuProducts, toggleMenuVisibility } from '../controllers/productController.js';
import { adminAuth, flexibleAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

router.get('/', flexibleAuth, getProducts);
router.get('/menu', getMenuProducts);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.put('/:id/toggle-menu', adminAuth, toggleMenuVisibility);
router.delete('/:id', adminAuth, deleteProduct);

export default router;
