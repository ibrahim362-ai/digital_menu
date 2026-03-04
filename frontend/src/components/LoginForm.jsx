import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, validateEmail, validatePassword, sanitizeInput } from '../utils/auth';

/**
 * Reusable Login Form Component
 */
const LoginForm = ({ role, title }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '', // Single field for email or username
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const isAdmin = role === 'admin';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate identifier (email or username)
    if (!formData.identifier) {
      newErrors.identifier = 'Email or Username is required';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Send identifier as both email and username to backend
      const credentials = {
        email: formData.identifier,
        username: formData.identifier,
        password: formData.password
      };

      await login(credentials, role);

      // Redirect to appropriate dashboard
      const redirectMap = {
        admin: '/admin',
      };
      navigate(redirectMap[role]);
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{title}</h2>
        
        {apiError && (
          <div className="error-banner" role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="identifier">
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className={errors.identifier ? 'error' : ''}
              disabled={loading}
              autoComplete="username"
              required
            />
            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={loading}
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
