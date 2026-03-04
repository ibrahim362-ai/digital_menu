import prisma from '../config/database.js';
import {
  validatePassword,
  hashPassword,
  comparePassword,
  isAccountLocked,
  shouldLockAccount,
  getLockoutTime,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getClientIp,
} from '../utils/security.js';
import {
  generateTokenPair,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  getUserSessions,
  revokeSession,
} from '../services/tokenService.js';
import {
  logLogin,
  logFailedLogin,
  logLogout,
  logAccountLocked,
  AUDIT_RESOURCES,
} from '../services/auditService.js';

// ============= ADMIN AUTHENTICATION =============

export const adminLogin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email/Username and password are required',
      });
    }

    // Find admin by email or username (email field can contain username)
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier }, // Allow login with name as username
        ],
      },
    });

    if (!admin) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid credentials',
      });
    }

    // Check if account is locked
    if (isAccountLocked(admin)) {
      await logFailedLogin(admin.id, 'admin', 'Account locked', req);
      return res.status(403).json({
        error: 'Account Locked',
        message: 'Your account has been temporarily locked due to too many failed login attempts',
        lockedUntil: admin.lockedUntil,
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      await logFailedLogin(admin.id, 'admin', 'Account inactive', req);
      return res.status(403).json({
        error: 'Account Inactive',
        message: 'Your account has been deactivated',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      // Increment failed login count
      const newFailedCount = admin.failedLoginCount + 1;
      const updateData = {
        failedLoginCount: newFailedCount,
      };

      // Lock account if threshold reached
      if (shouldLockAccount(newFailedCount)) {
        updateData.lockedUntil = getLockoutTime();
        await logAccountLocked(admin.id, 'admin', req);
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: updateData,
      });

      await logFailedLogin(admin.id, 'admin', 'Invalid password', req);

      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid credentials',
        attemptsRemaining: Math.max(0, 5 - newFailedCount),
      });
    }

    // Successful login - reset failed attempts and update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: getClientIp(req),
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokenPair(admin.id, 'admin', req);

    // Set cookies
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

    // Log successful login
    await logLogin(admin.id, 'admin', req);

    res.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Login failed',
    });
  }
};

// ============= TOKEN REFRESH =============

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No refresh token provided',
      });
    }

    const result = await refreshAccessToken(refreshToken, req);

    res.cookie('accessToken', result.accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', result.refreshToken, getRefreshTokenCookieOptions());

    res.json({
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
  }
};

// ============= LOGOUT =============

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    if (req.user) {
      await logLogout(req.user.id, req.user.role, req);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Logout failed',
    });
  }
};

// ============= SESSION MANAGEMENT =============

export const getSessions = async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user.id, req.user.role);
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch sessions',
    });
  }
};

export const revokeSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await revokeSession(parseInt(sessionId), req.user.id, req.user.role);
    res.json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to revoke session',
    });
  }
};

export const revokeAllSessions = async (req, res) => {
  try {
    await revokeAllUserTokens(req.user.id, req.user.role);
    res.json({
      success: true,
      message: 'All sessions revoked successfully',
    });
  } catch (error) {
    console.error('Revoke all sessions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to revoke sessions',
    });
  }
};

// ============= PROFILE =============

export const getProfile = async (req, res) => {
  try {
    const userModelMap = {
      admin: 'admin',
    };

    const userModel = userModelMap[req.user.role];
    const user = await prisma[userModel].findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        lastLoginAt: true,
        lastLoginIp: true,
        createdAt: true,
      },
    });

    res.json({
      ...user,
      role: req.user.role,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch profile',
    });
  }
};
