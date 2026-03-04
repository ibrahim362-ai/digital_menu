import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ============= PASSWORD SECURITY =============

export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const hashPassword = async (password) => {
  const saltRounds = 12; // High security
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// ============= JWT TOKEN MANAGEMENT =============

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'restaurant-system',
    audience: 'restaurant-api',
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'restaurant-system',
    audience: 'restaurant-api',
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'restaurant-system',
      audience: 'restaurant-api',
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'restaurant-system',
      audience: 'restaurant-api',
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// ============= SECURE RANDOM TOKEN GENERATION =============

export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// ============= COOKIE OPTIONS =============

export const getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
});

export const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
});

// ============= ACCOUNT LOCKOUT =============

export const LOCKOUT_CONFIG = {
  maxAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
};

export const isAccountLocked = (user) => {
  if (!user.lockedUntil) return false;
  return new Date() < new Date(user.lockedUntil);
};

export const shouldLockAccount = (failedLoginCount) => {
  return failedLoginCount >= LOCKOUT_CONFIG.maxAttempts;
};

export const getLockoutTime = () => {
  return new Date(Date.now() + LOCKOUT_CONFIG.lockoutDuration);
};

// ============= INPUT SANITIZATION =============

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS vectors
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// ============= IP ADDRESS EXTRACTION =============

export const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
};

export const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};
