import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface PrivateRouteProps {
  allowedRole: Role;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={`/${allowedRole}/login`} replace />;
  }

  if (user.role !== allowedRole) {
    // If logged in but wrong role, redirect to their respective dashboard
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};
