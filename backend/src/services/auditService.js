import prisma from '../config/database.js';
import { getClientIp, getUserAgent } from '../utils/security.js';

// ============= AUDIT LOG SERVICE =============

export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  FAILED_LOGIN: 'FAILED_LOGIN',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
};

export const AUDIT_RESOURCES = {
  ADMIN: 'Admin',
  PRODUCT: 'Product',
  CATEGORY: 'Category',
  ORDER: 'Order',
  QRCODE: 'QRCode',
  SETTINGS: 'Settings',
};

/**
 * Log an audit event
 * @param {Object} params - Audit log parameters
 * @param {number} params.userId - User ID
 * @param {string} params.userType - User type ('admin')
 * @param {string} params.action - Action performed (use AUDIT_ACTIONS)
 * @param {string} params.resource - Resource affected (use AUDIT_RESOURCES)
 * @param {number} params.resourceId - Resource ID
 * @param {Object} params.details - Additional details (will be JSON stringified)
 * @param {Object} params.req - Express request object
 */
export const logAudit = async ({
  userId,
  userType,
  action,
  resource = null,
  resourceId = null,
  details = null,
  req = null,
}) => {
  try {
    const ipAddress = req ? getClientIp(req) : null;
    const userAgent = req ? getUserAgent(req) : null;

    await prisma.auditLog.create({
      data: {
        userId,
        userType,
        action,
        resource,
        resourceId,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Don't throw - audit logging should not break the application
    console.error('Audit logging failed:', error);
  }
};

/**
 * Log successful login
 */
export const logLogin = async (userId, userType, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.LOGIN,
    req,
  });
};

/**
 * Log failed login attempt
 */
export const logFailedLogin = async (userId, userType, reason, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.FAILED_LOGIN,
    details: { reason },
    req,
  });
};

/**
 * Log logout
 */
export const logLogout = async (userId, userType, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.LOGOUT,
    req,
  });
};

/**
 * Log unauthorized access attempt
 */
export const logUnauthorizedAccess = async (userId, userType, attemptedResource, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
    resource: attemptedResource,
    req,
  });
};

/**
 * Log resource creation
 */
export const logCreate = async (userId, userType, resource, resourceId, details, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.CREATE,
    resource,
    resourceId,
    details,
    req,
  });
};

/**
 * Log resource update
 */
export const logUpdate = async (userId, userType, resource, resourceId, details, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.UPDATE,
    resource,
    resourceId,
    details,
    req,
  });
};

/**
 * Log resource deletion
 */
export const logDelete = async (userId, userType, resource, resourceId, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.DELETE,
    resource,
    resourceId,
    req,
  });
};

/**
 * Log account lockout
 */
export const logAccountLocked = async (userId, userType, req) => {
  await logAudit({
    userId,
    userType,
    action: AUDIT_ACTIONS.ACCOUNT_LOCKED,
    details: { reason: 'Too many failed login attempts' },
    req,
  });
};

/**
 * Get audit logs with filtering
 */
export const getAuditLogs = async (filters = {}) => {
  const { userId, userType, action, resource, startDate, endDate, limit = 100 } = filters;

  const where = {};
  if (userId) where.userId = userId;
  if (userType) where.userType = userType;
  if (action) where.action = action;
  if (resource) where.resource = resource;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  return await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

/**
 * Get recent activity for a user
 */
export const getUserActivity = async (userId, userType, limit = 50) => {
  return await prisma.auditLog.findMany({
    where: {
      userId,
      userType,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};
