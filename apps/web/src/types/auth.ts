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
  SET_RETRY_TOKEN = 'SET_RETRY_TOKEN',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  RESEND_VERIFICATION = 'RESEND_VERIFICATION',
  SET_MESSAGE = 'SET_MESSAGE',
  SET_FINISHED_ASYNC_ACTION = 'SET_FINISHED_ASYNC_ACTION',
}

export interface AuthError {
  status: 'error' | 'success'
  code: 'expired_token' | 'invalid_token' | 'internal_error' | 'success'
  message: string
  maskedEmail?: string
  retryToken?: string
}

export type SignUpAction =
  ReducerAction<AuthActionType.SIGN_UP>;

export type SetErrorAction =
  ReducerAction<AuthActionType.SET_ERROR, AuthError | null>;

export type SetMessageAction =
  ReducerAction<AuthActionType.SET_MESSAGE, string>;

export type LoginAction =
  ReducerAction<AuthActionType.LOGIN, User>;

export type LoginGuestAction =
  ReducerAction<AuthActionType.LOGIN_GUEST, User>;

export type LogoutAction =
  ReducerAction<AuthActionType.LOGOUT>;

export type VerifyTokenAction =
  ReducerAction<AuthActionType.VERIFY_ACCOUNT, string>;

export type ResendVerification =
  ReducerAction<AuthActionType.RESEND_VERIFICATION, string>;

export type SetRetryToken =
  ReducerAction<AuthActionType.SET_RETRY_TOKEN, string>;

export type AuthAction =
  | LoginAction
  | LoginGuestAction
  | SignUpAction
  | VerifyTokenAction
  | ResendVerification
  | LogoutAction
  | SetErrorAction
  | SetMessageAction
  | SetRetryToken
  | LoadingAction<AuthActionType.SET_LOADING>
  | FinishedAsyncAction<AuthActionType.SET_FINISHED_ASYNC_ACTION>;

export interface AuthState {
  user: User
  loading: boolean
  finishedAsyncAction: boolean
  message: string
  error: AuthError | null
  retryToken?: string
}

export interface AuthContextType {
  state: AuthState
  logout: () => void
  signUp: (credentials: AuthSignUpUser) => void
  loginGuest: (credentials: AuthLoginGuest) => void
  login: (credentials: AuthLoginUser) => void
  verifyToken: (token: string) => void
  resendVerification: (token: string) => void
}

export type AuthReducer = Reducer<AuthState, AuthAction>;
