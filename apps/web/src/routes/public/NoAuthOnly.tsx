import React from 'react';
import { Navigate } from 'react-router';
import useAuth from '@/hooks/useAuth';

interface Props {
  children: React.ReactNode
}

export default function NoAuthOnly({ children }: Props) {
  const { state } = useAuth();

  if (state.user && state.user?.id) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    children
  );
}
