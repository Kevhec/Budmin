import {
  Outlet,
} from 'react-router';

export default function AuthLayout() {
  return (
    <div className="min-h-screen px-4 grid place-content-center font-inter">
      <Outlet />
    </div>
  );
}
