import express from 'express';
import { getQRCodes, createQRCode, updateQRCode, deleteQRCode } from '../controllers/qrcodeController.js';
import { adminAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

router.get('/', adminAuth, getQRCodes);
router.post('/', adminAuth, createQRCode);
router.put('/:id', adminAuth, updateQRCode);
router.delete('/:id', adminAuth, deleteQRCode);

export default router;
