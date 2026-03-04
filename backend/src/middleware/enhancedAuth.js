import { verifyAccessToken, isAccountLocked } from '../utils/security.js';
import prisma from '../config/database.js';
import { logUnauthorizedAccess } from '../services/auditService.js';

// ============= ENHANCED AUTHENTICATION MIDDLEWARE =============

/**
 * Extract token from cookie or Authorization header
 */
const extractToken = (req) => {
  // Try cookie first (more secure)
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  
  // Fallback to Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

/**
 * Base authentication middleware
 */
const baseAuth = async (req, res, next, userType, userModel) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Verify role matches
    if (decoded.role !== userType) {
      await logUnauthorizedAccess(decoded.id, decoded.role, userType, req);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    // Fetch user from database
    const user = await prisma[userModel].findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        isActive: true,
        lockedUntil: true,
        passwordChangedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account has been deactivated',
      });
    }

    // Check if account is locked
    if (isAccountLocked(user)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account is temporarily locked due to too many failed login attempts',
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      name: user.name,
      role: userType,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Admin authentication middleware
 */
export const adminAuth = async (req, res, next) => {
  await baseAuth(req, res, next, 'admin', 'admin');
};

/**
 * Flexible authentication - accepts any authenticated user
 */
export const flexibleAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Determine user model based on role
    const userModelMap = {
      admin: 'admin',
    };

    const userModel = userModelMap[decoded.role];
    if (!userModel) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid user role',
      });
    }

    // Fetch user
    const user = await prisma[userModel].findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        isActive: true,
        lockedUntil: true,
      },
    });

    if (!user || !user.isActive || isAccountLocked(user)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Role-based authorization middleware
 * Usage: authorize(['admin'])
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logUnauthorizedAccess(req.user.id, req.user.role, allowedRoles.join(','), req);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
