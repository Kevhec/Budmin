import getAuthStatus from '@/lib/auth/getAuthStatus';
import {
  type AuthAction, AuthActionType, type AuthState,
} from '@/types';
import createBaseReducer, { defaultBaseState } from '../base/baseReducer';

const initialAuthState: AuthState = {
  ...defaultBaseState,
  user: {
    id: null,
    username: null,
    role: null,
    confirmed: false,
    createdAt: '',
    updatedAt: '',
  },
  status: 'unauthenticated',
};

function authDomainReducer(
  state: AuthState,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return ({
        ...state,
        user: action.payload,
        status: getAuthStatus(action.payload),
        loading: false,
      });
    case AuthActionType.LOGIN_GUEST:
      return ({
        ...state,
        user: action.payload,
        loading: false,
      });
    case AuthActionType.LOGOUT:
      return (initialAuthState);
    default:
      return state;
  }
}

const authReducer = createBaseReducer<AuthState, AuthAction>(authDomainReducer);

export {
  initialAuthState,
  authReducer,
};
