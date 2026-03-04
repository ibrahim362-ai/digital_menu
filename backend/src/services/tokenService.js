import prisma from '../config/database.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateSecureToken,
  getClientIp,
  getUserAgent,
} from '../utils/security.js';

// ============= TOKEN SERVICE =============

/**
 * Generate access and refresh tokens for a user
 */
export const generateTokenPair = async (userId, userType, req) => {
  const payload = {
    id: userId,
    role: userType,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateSecureToken();

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      userType,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress: req ? getClientIp(req) : null,
      userAgent: req ? getUserAgent(req) : null,
    },
  });

  return { accessToken, refreshToken };
};

/**
 * Verify and rotate refresh token
 */
export const refreshAccessToken = async (refreshToken, req) => {
  // Find refresh token in database
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord) {
    throw new Error('Invalid refresh token');
  }

  // Check if token is revoked
  if (tokenRecord.isRevoked) {
    throw new Error('Refresh token has been revoked');
  }

  // Check if token is expired
  if (new Date() > tokenRecord.expiresAt) {
    throw new Error('Refresh token has expired');
  }

  // Generate new token pair
  const { accessToken, refreshToken: newRefreshToken } = await generateTokenPair(
    tokenRecord.userId,
    tokenRecord.userType,
    req
  );

  // Revoke old refresh token (token rotation)
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { isRevoked: true },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    userId: tokenRecord.userId,
    userType: tokenRecord.userType,
  };
};

/**
 * Revoke a specific refresh token
 */
export const revokeRefreshToken = async (refreshToken) => {
  try {
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Revoke all refresh tokens for a user
 */
export const revokeAllUserTokens = async (userId, userType) => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      userType,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
    },
  });
};

/**
 * Clean up expired tokens (run periodically)
 */
export const cleanupExpiredTokens = async () => {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
};

/**
 * Get active sessions for a user
 */
export const getUserSessions = async (userId, userType) => {
  return await prisma.refreshToken.findMany({
    where: {
      userId,
      userType,
      isRevoked: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true,
    },
  });
};

/**
 * Revoke a specific session
 */
export const revokeSession = async (sessionId, userId, userType) => {
  await prisma.refreshToken.updateMany({
    where: {
      id: sessionId,
      userId,
      userType,
    },
    data: {
      isRevoked: true,
    },
  });
};
