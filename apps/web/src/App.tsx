import {
  BrowserRouter, Route, Routes,
} from 'react-router';
import { TooltipProvider } from '@budmin/ui';
import { AuthProvider } from './context/AuthProvider';
import Login from './routes/public/Login';
import Guest from './routes/public/Guest';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Dashboard from './routes/private/Dashboard';
import ProtectedRoute from './routes/private/ProtectedRoute';
import Transactions from './routes/private/Transactions';
import Budgets from './routes/private/Budgets';
import VerifyAccount from './routes/public/VerifyAccount';
import SignUp from './routes/public/SignUp';
import SuccessSignUp from './routes/public/SuccessSignUp';
import NoAuthOnly from './routes/public/NoAuthOnly';
import { DashboardProvider } from './context/DashboardProvider';

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route
                index
                element={(
                  <NoAuthOnly>
                    <Login />
                  </NoAuthOnly>
                )}
              />
              <Route
                path="register"
                element={(
                  <NoAuthOnly>
                    <SignUp />
                  </NoAuthOnly>
                )}
              >
                <Route
                  path="success"
                  element={(
                    <NoAuthOnly>
                      <SuccessSignUp />
                    </NoAuthOnly>
                  )}
                />
              </Route>
              <Route
                path="/login/guest"
                element={(
                  <NoAuthOnly>
                    <Guest />
                  </NoAuthOnly>
                )}
              />
              <Route
                path="/verify/:token"
                element={(
                  <VerifyAccount />
                )}
              />
            </Route>
            <Route path="app" element={<AppLayout />}>
              <Route
                path="dashboard"
                element={(
                  <ProtectedRoute>
                    <DashboardProvider>
                      <Dashboard />
                    </DashboardProvider>
                  </ProtectedRoute>
              )}
              />
              <Route
                path="budgets"
                element={(
                  <ProtectedRoute>
                    <Budgets />
                  </ProtectedRoute>
              )}
              />
              <Route
                path="transactions"
                element={(
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
              )}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
