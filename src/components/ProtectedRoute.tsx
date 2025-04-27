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
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute check:', {
      isAuthenticated,
      isLoading,
      currentUser: user,
      allowedRoles,
      currentPath: location.pathname
    });
  }, [isAuthenticated, isLoading, user, allowedRoles, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('Auth is still loading, showing loading state');
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
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
