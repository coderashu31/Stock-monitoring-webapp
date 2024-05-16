import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />
  );
};

export default ProtectedRoute;
