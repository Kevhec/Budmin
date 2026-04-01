import useAuth from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

export default function UnverifiedRoute() {
  const { state } = useAuth();

  if (state.status === 'authenticated') return <Navigate to="/app/dashboard" />;
  if (state.status === 'unauthenticated') return <Navigate to="/" />;

  return <Outlet />;
}
