import { type Dispatch } from 'react';
import getCategories from '@/lib/category/getCategories';
import type {
  ApiResponse, CategoriesMonthlyBalance, CategoryAction,
} from '@/types';
import { CategoryActionType } from '@/types';
import axiosClient from '@/config/axios';

async function syncCategories(dispatch: Dispatch<CategoryAction>) {
  dispatch({
    type: CategoryActionType.SET_LOADING,
    payload: true,
  });
  try {
    const newCategories = await getCategories();

    if (!newCategories) return;

    dispatch({
      type: CategoryActionType.SYNC_CATEGORIES,
      payload: newCategories,
    });
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    dispatch({
      type: CategoryActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function getBalance(dispatch: Dispatch<CategoryAction>, date?: string) {
  dispatch({
    type: CategoryActionType.SET_LOADING,
    payload: true,
  });
  try {
    const params = {
      date,
    };

    const { data } = await axiosClient.get<ApiResponse<CategoriesMonthlyBalance>>('/category/balance/', {
      params,
    });

    const newBalance = data.data;

    if (!newBalance) return;

    dispatch({
      type: CategoryActionType.GET_BALANCE,
      payload: newBalance,
    });
  } catch (error) {
    dispatch({
      type: CategoryActionType.GET_BALANCE,
      payload: null,
    });
  } finally {
    dispatch({
      type: CategoryActionType.SET_LOADING,
      payload: false,
    });
  }
}

export {
  syncCategories,
  getBalance,
};
