import express from 'express';
import {
  updateAdminCredentials,
  getRestaurantSettings,
  updateRestaurantSettings
} from '../controllers/settingsController.js';
import { adminAuth } from '../middleware/enhancedAuth.js';

const router = express.Router();

// Public route for getting restaurant settings (for frontend display)
router.get('/restaurant', getRestaurantSettings);

// All routes below require admin authentication
router.use(adminAuth);

// Admin routes
router.put('/admin', updateAdminCredentials);
router.put('/restaurant', updateRestaurantSettings);

export default router;
