import express from 'express';
import {
  adminLogin,
  refresh,
  logout,
  getProfile,
  getSessions,
  revokeSessionById,
  revokeAllSessions,
} from '../controllers/enhancedAuthController.js';
import { authRateLimiter } from '../middleware/securityMiddleware.js';
import { flexibleAuth } from '../middleware/enhancedAuth.js';
import { login, getProfile as getOldProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ============= NEW SECURE AUTH ENDPOINTS =============

// Login endpoints (with strict rate limiting)
router.post('/admin/login', authRateLimiter, adminLogin);

// Token refresh
router.post('/refresh', refresh);

// Logout (requires authentication)
router.post('/logout', flexibleAuth, logout);

// Profile (requires authentication)
router.get('/profile', flexibleAuth, getProfile);

// Session management (requires authentication)
router.get('/sessions', flexibleAuth, getSessions);
router.delete('/sessions/:sessionId', flexibleAuth, revokeSessionById);
router.post('/sessions/revoke-all', flexibleAuth, revokeAllSessions);

// ============= OLD ENDPOINTS (BACKWARD COMPATIBILITY) =============
router.post('/login', authRateLimiter, login);
router.get('/old-profile', authMiddleware, getOldProfile);

export default router;
