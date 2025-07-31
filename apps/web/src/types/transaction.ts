import { type Reducer } from 'react';
import { z } from 'zod';
import { transactionSchema } from '@/schemas/creation';
import type { Category } from './category';
import type { PaginatedApiResponse } from './api';
import type { LoadingAction, ReducerAction, SimplifiedConcurrence } from './common';
import type { BalanceData } from './balance';
import { type Budget } from './budget';

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  budgetId?: string;
  categoryId?: string
  budget?: Budget | null;
  category?: Category | null;
  hidden?: boolean
  concurrence?: SimplifiedConcurrence
}

export interface PaginatedParams {
  page?: number
  limit?: number
  date?: Date
  presetUrl?: string
  include?: string
}

export type CreateTransactionParams = z.infer<typeof transactionSchema>;

export enum TransactionActionType {
  SYNC_RECENT = 'SYNC_RECENT',
  SYNC_PAGINATED = 'SYNC_PAGINATED',
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
  GET_BALANCE = 'GET_BALANCE',
  UPDATE_TRANSACTION = 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION = 'DELETE_TRANSACTION',
  SET_LOADING = 'SET_LOADING',
}

export type SyncRecentTransactionsAction =
  ReducerAction<TransactionActionType.SYNC_RECENT, Transaction[]>;

export type SyncPaginatedTransactionsAction =
  ReducerAction<TransactionActionType.SYNC_PAGINATED, PaginatedApiResponse<Transaction[]>>;

export type GetTransactionBalanceAction =
  ReducerAction<TransactionActionType.GET_BALANCE, BalanceData>;

export type CreateTransactionAction =
  ReducerAction<TransactionActionType.CREATE_TRANSACTION, Transaction | null>;

export type UpdateTransactionAction =
  ReducerAction<TransactionActionType.UPDATE_TRANSACTION, Transaction | null>;

export type DeleteTransactionAction =
  ReducerAction<TransactionActionType.DELETE_TRANSACTION, { deletedTransactionId: string }>;

export type TransactionAction =
  | SyncRecentTransactionsAction
  | SyncPaginatedTransactionsAction
  | CreateTransactionAction
  | GetTransactionBalanceAction
  | UpdateTransactionAction
  | DeleteTransactionAction
  | LoadingAction<TransactionActionType.SET_LOADING>;

export interface TransactionState {
  recentTransactions: Transaction[],
  balance: BalanceData
  paginatedTransactions: PaginatedApiResponse<Transaction[]>,
  loading: boolean
}

export type TransactionReducer = Reducer<TransactionState, TransactionAction>;

export interface TransactionsContextType {
  state: TransactionState
  createTransaction: (data: CreateTransactionParams) => void
  getBalance: (from?: string, to?: string) => void
  changePage: (params: PaginatedParams) => void
  updateTransaction: (id: string, data: CreateTransactionParams) => void
  deleteTransaction: (id: string) => void
}
