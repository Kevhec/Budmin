import {
  createContext, useCallback, useEffect, useMemo, useReducer,
} from 'react';
import type {
  AuthContextType,
  AuthLoginGuest,
  AuthSignUpUser,
  AuthLoginUser,
} from '@/types';
import { authReducer, initialAuthState } from '@/reducers/auth/authReducer';
import {
  login as loginAction,
  logout as logoutAction,
  checkAuth as checkAuthAction,
  loginGuest as loginGuestAction,
  verifyToken as verifyTokenAction,
  signUp as signUpAction,
} from '@/reducers/auth/authActions';

interface Props {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    checkAuthAction(dispatch);
  }, []);

  const login = (credentials: AuthLoginUser) => {
    loginAction(dispatch, credentials);
  };

  const logout = () => {
    logoutAction(dispatch);
  };

  const loginGuest = (credentials: AuthLoginGuest) => {
    loginGuestAction(dispatch, credentials);
  };

  const verifyToken = useCallback((token: string) => {
    verifyTokenAction(dispatch, token);
  }, []);

  const signUp = useCallback((credentials: AuthSignUpUser) => {
    signUpAction(dispatch, credentials);
  }, []);

  const contextValue = useMemo<AuthContextType>(() => ({
    state,
    loginGuest,
    login,
    signUp,
    logout,
    verifyToken,
  }), [state, verifyToken, signUp]);

  if (state.loading && !state.user.id) {
    return <p>LOADING</p>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
