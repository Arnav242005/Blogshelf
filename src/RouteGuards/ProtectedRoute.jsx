import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(AuthContext);

  if (!state.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
