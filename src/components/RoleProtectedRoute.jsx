import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



export default function RoleProtectedRoute({ children, requiredRole, fallback = '/login' }) {
  const { currentUser, role, loading } = useAuth();

  // still checking auth state -> return nothing (or a loader)
  if (loading) return null;

  // not logged in -> redirect to login
  if (!currentUser) return <Navigate to={fallback} replace />;

  // no role or wrong role -> redirect to home (or other)
  if ((role || 'consumer') !== requiredRole) return <Navigate to="/" replace />;

  return children;
}
