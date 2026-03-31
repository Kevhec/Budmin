import { type Dispatch } from 'react';
import type {
  AuthAction, AuthLoginGuest, AuthLoginUser, AuthResponse,
  AuthSignUpUser,
  MessageResponse,
} from '@/types';
import { AuthActionType, BaseActionType } from '@/types';
import axiosClient from '@/config/axios';

async function login(dispatch: Dispatch<AuthAction>, credentials: AuthLoginUser) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  dispatch({
    type: BaseActionType.DELETE_MESSAGE,
    payload: ['sessionLoginError', 'sessionLoginSuccess'],
  });

  try {
    const { data } = await axiosClient.post<AuthResponse>('/user/login', {
      email: credentials.email,
      password: credentials.password,
    });

    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionLoginSuccess: {
          text: 'User successfully logged in',
          type: 'success',
        },
      },
    });

    dispatch({
      type: AuthActionType.LOGIN,
      payload: data.data,
    });
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionLoginError: {
          text: error.response.data.message,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
  }
}

async function loginGuest(dispatch: Dispatch<AuthAction>, credentials: AuthLoginGuest) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  dispatch({
    type: BaseActionType.DELETE_MESSAGE,
    payload: ['sessionLoginError', 'sessionLoginSuccess'],
  });

  try {
    const { data } = await axiosClient.post<AuthResponse>('/user/guest', {
      username: credentials.username,
    });

    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionLoginSuccess: {
          text: 'User successfully logged in',
          type: 'success',
        },
      },
    });

    dispatch({
      type: AuthActionType.LOGIN_GUEST,
      payload: data.data,
    });
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionLoginError: {
          text: error.response.data.message,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
  }
}

async function signUp(
  dispatch: Dispatch<AuthAction>,
  credentials: AuthSignUpUser,
) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  dispatch({
    type: BaseActionType.DELETE_MESSAGE,
    payload: ['signupSuccess', 'signupError'],
  });
  dispatch({
    type: BaseActionType.SET_FINISHED_ASYNC_ACTION,
    payload: false,
  });

  const {
    username,
    email,
    birthday,
    password,
    repeatPassword,
  } = credentials;

  try {
    const { data } = await axiosClient.post<MessageResponse>('/user/signup', {
      username,
      email,
      birthday,
      password,
      repeatPassword,
    });

    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        signupSuccess: {
          text: data.data.message,
          type: 'success',
        },
      },
    });
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        signupError: {
          text: error.response.data.error,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
    dispatch({
      type: BaseActionType.SET_FINISHED_ASYNC_ACTION,
      payload: true,
    });
  }
}

async function logout(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  try {
    await axiosClient.post('/user/logout');

    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionLogoutSuccess: {
          text: 'User logged out successfully',
          type: 'success',
        },
      },
    });

    dispatch({
      type: AuthActionType.LOGOUT,
      payload: undefined,
    });
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionLogoutError: {
          text: error.response.data.message,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
  }
}

async function checkAuth(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.get<AuthResponse>('/user/');

    dispatch({
      type: AuthActionType.LOGIN,
      payload: data.data,
    });
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        sessionRefreshError: {
          text: error.response.data.message,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
  }
}

async function verifyToken(dispatch: Dispatch<AuthAction>, token: string) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  dispatch({ type: BaseActionType.SET_FINISHED_ASYNC_ACTION, payload: false });
  dispatch({
    type: BaseActionType.DELETE_MESSAGE,
    payload: ['verificationVerifyTokenSuccess', 'verificationVerifyTokenError'],
  });

  try {
    const { data } = await axiosClient.post<MessageResponse>(`/user/verify/${token || ''}`);

    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        verificationVerifyTokenSuccess: {
          text: data.data.message,
          type: 'success',
        },
      },
    });
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        verificationVerifyTokenError: {
          text: error.response.data.error,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
    dispatch({ type: BaseActionType.SET_FINISHED_ASYNC_ACTION, payload: true });
  }
}

async function resendVerificationEmail(dispatch: Dispatch<AuthAction>, email: string) {
  dispatch({ type: BaseActionType.SET_LOADING, payload: true });
  dispatch({ type: BaseActionType.SET_FINISHED_ASYNC_ACTION, payload: false });
  dispatch({
    type: BaseActionType.SET_MESSAGE,
    payload: {},
  });
  try {
    const { data } = await axiosClient.post<MessageResponse>('/user/verify/resend', {
      email,
    });

    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        verificationResendEmailSuccess: {
          text: data.data.message,
          type: 'success',
        },
      },
    });
    console.log(data);
  } catch (error: any) {
    dispatch({
      type: BaseActionType.SET_MESSAGE,
      payload: {
        verificationResendEmailError: {
          text: error.response.data.error,
          type: 'error',
        },
      },
    });
  } finally {
    dispatch({ type: BaseActionType.SET_LOADING, payload: false });
    dispatch({ type: BaseActionType.SET_FINISHED_ASYNC_ACTION, payload: true });
  }
}

export {
  login,
  loginGuest,
  signUp,
  logout,
  checkAuth,
  verifyToken,
  resendVerificationEmail,
};
