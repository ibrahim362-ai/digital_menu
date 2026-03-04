import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

/**
 * Protected Route Component
 * Restricts access based on authentication and role
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = getCurrentUser();

  // Not authenticated - redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectMap = {
      admin: '/admin',
    };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  // Authorized - render children
  return children;
};

export default ProtectedRoute;
