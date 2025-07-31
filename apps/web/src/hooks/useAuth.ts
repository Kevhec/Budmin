import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';
import type { AuthContextType } from '@/types';

function useAuth(): AuthContextType {
  const authContext = useContext(AuthContext);
  if (authContext === undefined || authContext === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
}

export default useAuth;
