import { type Reducer } from 'react';
import { z } from 'zod';
import { budgetSchema } from '@/schemas/creation';
import type { PaginatedApiResponse } from './api';
import type { LoadingAction, ReducerAction, SimplifiedConcurrence } from './common';
import type { PaginatedParams } from './transaction';

export interface Budget {
  id: string
  name: string
  totalAmount: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  userId: string
  balance: {
    totalExpense: number
    totalIncome: number
  }
  transactionsCount: number
  hidden?: boolean
  concurrence?: SimplifiedConcurrence
}

export type CreateBudgetParams = z.infer<typeof budgetSchema>;

export enum BudgetActionType {
  SYNC_RECENT = 'SYNC_RECENT',
  SYNC_PAGINATED = 'SYNC_PAGINATED',
  CREATE_BUDGET = 'CREATE_BUDGET',
  SET_BUDGETS = 'SET_BUDGETS',
  SET_LOADING = 'SET_LOADING',
}

export type SetBudgetsAction =
  ReducerAction<BudgetActionType.SET_BUDGETS, Budget[]>;

export type SyncRecentBudgetsAction =
  ReducerAction<BudgetActionType.SYNC_RECENT, Budget[]>;

export type SyncPaginatedBudgetsAction =
  ReducerAction<BudgetActionType.SYNC_PAGINATED, PaginatedApiResponse<Budget[]>>;

export type CreateBudgetAction =
  ReducerAction<BudgetActionType.CREATE_BUDGET, Budget | null>;

export type BudgetAction =
  | SyncRecentBudgetsAction
  | SyncPaginatedBudgetsAction
  | CreateBudgetAction
  | SetBudgetsAction
  | LoadingAction<BudgetActionType.SET_LOADING>;

export interface BudgetState {
  recentBudgets: Budget[]
  budgets: Budget[]
  paginatedBudgets: PaginatedApiResponse<Budget[]>
  loading: boolean
}

export type BudgetReducer = Reducer<BudgetState, BudgetAction>;

export interface BudgetContextType {
  state: BudgetState
  createBudget: (data: CreateBudgetParams) => void
  getBudgets: () => void
  getPaginatedBudgets: (options: PaginatedParams) => void
  updateRecentBudgets: (date?: Date | string) => void
}

export type BudgetBalanceChartData = {
  date: string,
  balance: number,
  amount?: number,
  description?: string
};

export interface BudgetAmountData {
  totalAmount: number;
  netAmount: number;
  amountBounds: {
    safe: {
      y1: number;
    };
    warn: {
      y1: number;
      y2: number;
    };
    danger: {
      y2: number;
    };
  };
}

export type BudgetAmountDataNullable = BudgetAmountData | null;
