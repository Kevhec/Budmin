import { type Reducer } from 'react';
import type { ReducerAction, LoadingAction } from './common';

export interface Category {
  id: string;
  name: string;
  color: string;
  key: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
}

export interface CategoriesMonthlyBalance {
  month: number;
  balance: Balance[];
}

export interface Balance {
  totalIncome: number;
  totalExpense: number;
  category: Category;
}

export enum CategoryActionType {
  SYNC_CATEGORIES = 'SYNC_CATEGORIES',
  SET_LOADING = 'SET_LOADING',
  GET_BALANCE = 'GET_BALANCE',
}

export type SyncCategoriesAction =
  ReducerAction<CategoryActionType.SYNC_CATEGORIES, Category[]>;

export type GetCategoryBalanceAction =
  ReducerAction<CategoryActionType.GET_BALANCE, CategoriesMonthlyBalance | null>;

export type CategoryAction =
  | SyncCategoriesAction
  | GetCategoryBalanceAction
  | LoadingAction<CategoryActionType.SET_LOADING>;

export interface CategoryState {
  categories: Category[]
  monthBalance: CategoriesMonthlyBalance | null
  loading: boolean
}

export type CategoryReducer = Reducer<CategoryState, CategoryAction>;

export interface CategoriesContextType {
  state: CategoryState
  updateBalance: () => void
}
