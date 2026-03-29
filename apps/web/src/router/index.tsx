import AuthLayout from '@/layouts/AuthLayout';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from '@/layouts/AppLayout';
import PublicRoute from './guards/PublicRoute';
import Login from './pages/public/Login';
import SignUp from './pages/public/SignUp';
import SuccessSignUp from './pages/public/SuccessSignUp';
import Guest from './pages/public/Guest';
import ResendVerification from './pages/auth/ResendVerification';
import VerifyAccount from './pages/public/VerifyAccount';
import PrivateRoute from './guards/PrivateRoute';
import Dashboard from './pages/private/Dashboard';
import Budgets from './pages/private/Budgets';
import Transactions from './pages/private/Transactions';
import UnverifiedRoute from './guards/UnverifiedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route index element={<Login />} />
            <Route path="register" element={<SignUp />} />
            <Route path="register/success" element={<SuccessSignUp />} />
            <Route path="login/guest" element={<Guest />} />
          </Route>
        </Route>
        <Route element={<UnverifiedRoute />}>
          <Route path="verify/:token" element={<VerifyAccount />} />
          <Route path="verify/resend" element={<ResendVerification />} />
        </Route>
        <Route path="app" element={<AppLayout />}>
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
