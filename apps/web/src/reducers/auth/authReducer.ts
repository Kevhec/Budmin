import {
  type AuthAction, AuthActionType, type AuthState,
} from '@/types';

const initialAuthState: AuthState = {
  user: {
    id: null,
    username: null,
    role: null,
    confirmed: false,
    createdAt: '',
    updatedAt: '',
  },
  loading: true,
  finishedAsyncAction: false,
  message: '',
  error: '',
};

function authReducer(
  state: AuthState,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return ({
        ...state,
        user: action.payload,
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
    case AuthActionType.SET_FINISHED_ASYNC_ACTION:
      return ({
        ...state,
        finishedAsyncAction: action.payload,
      });
    case AuthActionType.SET_ERROR:
      return ({
        ...state,
        error: action.payload,
      });
    case AuthActionType.SET_MESSAGE:
      return ({
        ...state,
        message: action.payload,
      });
    case AuthActionType.SET_LOADING:
      return ({
        ...state,
        loading: action.payload,
      });
    default:
      return state;
  }
}

export {
  initialAuthState,
  authReducer,
};
