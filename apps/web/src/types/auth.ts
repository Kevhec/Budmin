import { type Reducer } from 'react';
import { type ApiResponse } from './api';
import type { FinishedAsyncAction, LoadingAction, ReducerAction } from './common';

export interface User {
  id: string | null
  username: string | null
  role: string | null
  confirmed: boolean
  email?: string
  createdAt: string
  updatedAt: string
}

export interface AuthLoginGuest {
  username: string
}

export interface AuthLoginUser {
  email: string
  password: string
}

export interface AuthSignUpUser {
  username: string
  email: string
  birthday: Date
  password: string
  repeatPassword: string
}

export type AuthResponse = ApiResponse<User>;

export enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGIN_GUEST = 'LOGIN_GUEST',
  SIGN_UP = 'SIGN_UP',
  LOGOUT = 'LOGOUT',
  SET_ERROR = 'SET_ERROR',
  SET_LOADING = 'SET_LOADING',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  SET_MESSAGE = 'SET_MESSAGE',
  SET_FINISHED_ASYNC_ACTION = 'SET_FINISHED_ASYNC_ACTION',
}

export type SignUpAction =
  ReducerAction<AuthActionType.SIGN_UP>;

export type SetErrorAction =
  ReducerAction<AuthActionType.SET_ERROR, string>;

export type SetMessageAction =
  ReducerAction<AuthActionType.SET_MESSAGE, string>;

export type LoginAction =
  ReducerAction<AuthActionType.LOGIN, User>;

export type LoginGuestAction =
  ReducerAction<AuthActionType.LOGIN_GUEST, User>;

export type LogoutAction =
  ReducerAction<AuthActionType.LOGOUT>;

export type VerifyTokenAction =
  ReducerAction<AuthActionType.VERIFY_ACCOUNT>;

export type AuthAction =
  | LoginAction
  | LoginGuestAction
  | SignUpAction
  | LogoutAction
  | SetErrorAction
  | SetMessageAction
  | LoadingAction<AuthActionType.SET_LOADING>
  | FinishedAsyncAction<AuthActionType.SET_FINISHED_ASYNC_ACTION>;

export interface AuthState {
  user: User
  loading: boolean
  finishedAsyncAction: boolean
  message: string
  error: string
}

export interface AuthContextType {
  state: AuthState
  logout: () => void
  signUp: (credentials: AuthSignUpUser) => void
  loginGuest: (credentials: AuthLoginGuest) => void
  login: (credentials: AuthLoginUser) => void
  verifyToken: (token: string) => void
}

export type AuthReducer = Reducer<AuthState, AuthAction>;
