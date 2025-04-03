
import React, { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../lib/types';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // For debugging purposes
  useEffect(() => {
    console.log('ProtectedRoute check:', {
      isAuthenticated,
      currentUser: user,
      allowedRoles,
      currentPath: location.pathname
    });
  }, [isAuthenticated, user, allowedRoles, location]);

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has allowed role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log('User does not have required role, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // If children are provided, render them
  if (children) {
    return <>{children}</>;
  }

  // Otherwise, use Outlet for nested routes
  return <Outlet />;
};

export default ProtectedRoute;
