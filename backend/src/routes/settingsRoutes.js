import express from 'express';
import {
  updateAdminCredentials
} from '../controllers/settingsController.js';
import { adminAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// Admin routes
router.put('/admin', updateAdminCredentials);

export default router;
