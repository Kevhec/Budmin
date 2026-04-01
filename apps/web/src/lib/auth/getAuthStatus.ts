import type { AuthStatus, User } from '@/types';

function getAuthStatus(user?: User): AuthStatus {
  if (!user || !user.id) return 'unauthenticated';
  if (!user.confirmed) return 'unverified';
  return 'authenticated';
}

export default getAuthStatus;
