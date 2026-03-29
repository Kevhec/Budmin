import { Navigate, Outlet } from 'react-router';
import useAuth from '@/hooks/useAuth';

export default function PrivateRoute() {
  const { state: { status } } = useAuth();

  if (status === 'unauthenticated') return <Navigate to="/" replace />;
  if (status === 'unverified') return <Navigate to="/verify/resend" replace />;

  return <Outlet />;
}
