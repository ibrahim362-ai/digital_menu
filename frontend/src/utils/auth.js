// ============= AUTHENTICATION UTILITIES =============

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * API client with automatic token refresh
 */
class ApiClient {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async request(url, options = {}) {
    const config = {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);

      // Handle 401 - try to refresh token
      if (response.status === 401 && !url.includes('/auth/refresh')) {
        if (this.isRefreshing) {
          // Wait for token refresh
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return this.request(url, options);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        this.isRefreshing = true;

        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });

          if (refreshResponse.ok) {
            this.isRefreshing = false;
            this.processQueue(null);
            // Retry original request
            return this.request(url, options);
          } else {
            // Refresh failed - logout
            this.isRefreshing = false;
            this.processQueue(new Error('Token refresh failed'), null);
            this.handleLogout();
            throw new Error('Session expired');
          }
        } catch (error) {
          this.isRefreshing = false;
          this.processQueue(error, null);
          this.handleLogout();
          throw error;
        }
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        const data = await response.json();
        throw new Error(data.message || 'Access denied');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  async get(url) {
    const response = await this.request(url, { method: 'GET' });
    return response.json();
  }

  async post(url, data) {
    const response = await this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(url, data) {
    const response = await this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(url) {
    const response = await this.request(url, { method: 'DELETE' });
    return response.json();
  }
}

export const apiClient = new ApiClient();

// ============= AUTHENTICATION FUNCTIONS =============

/**
 * Login function
 */
export const login = async (credentials, role) => {
  const endpoints = {
    admin: '/auth/admin/login',
  };

  const response = await fetch(`${API_BASE_URL}${endpoints[role]}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store user info in localStorage
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

/**
 * Logout function
 */
export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Get user profile
 */
export const getProfile = async () => {
  return apiClient.get('/auth/profile');
};

/**
 * Get active sessions
 */
export const getSessions = async () => {
  return apiClient.get('/auth/sessions');
};

/**
 * Revoke a specific session
 */
export const revokeSession = async (sessionId) => {
  return apiClient.delete(`/auth/sessions/${sessionId}`);
};

/**
 * Revoke all sessions
 */
export const revokeAllSessions = async () => {
  return apiClient.post('/auth/sessions/revoke-all');
};

// ============= INPUT VALIDATION =============

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};
