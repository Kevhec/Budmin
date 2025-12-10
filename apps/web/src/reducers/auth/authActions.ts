import { type Dispatch } from 'react';
import type {
  AuthAction, AuthLoginGuest, AuthLoginUser, AuthResponse,
  AuthSignUpUser,
  MessageResponse,
} from '@/types';
import { AuthActionType } from '@/types';
import axiosClient from '@/config/axios';

async function login(dispatch: Dispatch<AuthAction>, credentials: AuthLoginUser) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.post<AuthResponse>('/user/login', {
      email: credentials.email,
      password: credentials.password,
    });

    dispatch({
      type: AuthActionType.LOGIN,
      payload: data.data,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function loginGuest(dispatch: Dispatch<AuthAction>, credentials: AuthLoginGuest) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.post<AuthResponse>('/user/guest', {
      username: credentials.username,
    });

    dispatch({
      type: AuthActionType.LOGIN_GUEST,
      payload: data.data,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function signUp(
  dispatch: Dispatch<AuthAction>,
  credentials: AuthSignUpUser,
) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  dispatch({
    type: AuthActionType.SET_MESSAGE,
    payload: '',
  });
  dispatch({
    type: AuthActionType.SET_ERROR,
    payload: '',
  });
  dispatch({
    type: AuthActionType.SET_FINISHED_ASYNC_ACTION,
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
      type: AuthActionType.SET_MESSAGE,
      payload: data.data.message,
    });
  } catch (error: any) {
    dispatch({
      type: AuthActionType.SET_ERROR,
      payload: error.response.data.error,
    });
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    dispatch({
      type: AuthActionType.SET_FINISHED_ASYNC_ACTION,
      payload: true,
    });
  }
}

async function logout(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    await axiosClient.post('/user/logout');

    dispatch({
      type: AuthActionType.LOGOUT,
      payload: undefined,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function checkAuth(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.get<AuthResponse>('/user/');

    dispatch({
      type: AuthActionType.LOGIN,
      payload: data.data,
    });
  } catch (error: any) {
    // TODO: Handle errors as an array with identifiers
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function verifyToken(dispatch: Dispatch<AuthAction>, token: string) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  dispatch({ type: AuthActionType.SET_FINISHED_ASYNC_ACTION, payload: false });
  dispatch({
    type: AuthActionType.SET_MESSAGE,
    payload: '',
  });
  dispatch({
    type: AuthActionType.SET_ERROR,
    payload: '',
  });

  try {
    const { data } = await axiosClient.post<MessageResponse>(`/user/verify/${token || ''}`);

    dispatch({
      type: AuthActionType.SET_MESSAGE,
      payload: data.data.message,
    });
  } catch (error: any) {
    dispatch({
      type: AuthActionType.SET_ERROR,
      payload: error.response.data.error,
    });
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    dispatch({ type: AuthActionType.SET_FINISHED_ASYNC_ACTION, payload: true });
  }
}

export {
  login,
  loginGuest,
  signUp,
  logout,
  checkAuth,
  verifyToken,
};
