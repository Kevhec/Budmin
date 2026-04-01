import { Navigate, Outlet } from 'react-router';
import useAuth from '@/hooks/useAuth';

export default function PublicRoute() {
  const { state } = useAuth();

  if (state.status === 'unverified') return <Navigate to="/verify/resend" />;
  if (state.status === 'authenticated') return <Navigate to="/app/dashboard" />;

  return <Outlet />;
}
