import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { state } = useAuth();
  const location = useLocation();

  if (state.user && !state.user?.id) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    children
  );
}
