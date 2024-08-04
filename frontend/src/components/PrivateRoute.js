import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
