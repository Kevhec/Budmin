import { getPaginatedBudgets } from '@/lib/budget';
import type {
  Budget, BudgetAction, BudgetState, CreateBudgetParams, PaginatedParams,
} from '@/types';
import { BudgetActionType } from '@/types';
import { type Dispatch } from 'react';
import axiosClient from '@/config/axios';
import formatBudgetData from '@/lib/budget/formatBudgetData';
import { initialBudgetState, initialRecentBudgetsState } from './budgetReducer';

async function syncRecentBudgets(dispatch: Dispatch<BudgetAction>) {
  dispatch({
    type: BudgetActionType.SET_LOADING,
    payload: true,
  });

  try {
    const response = await getPaginatedBudgets({
      page: 1,
      limit: 4,
      date: new Date(),
    });

    const recentBudgets = response.data;

    if (recentBudgets) {
      dispatch({
        type: BudgetActionType.SYNC_RECENT,
        payload: recentBudgets,
      });
    }
  } catch (error) {
    dispatch({
      type: BudgetActionType.SYNC_RECENT,
      payload: initialRecentBudgetsState,
    });
  } finally {
    dispatch({
      type: BudgetActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function getBudgets(
  dispatch: Dispatch<BudgetAction>,
) {
  dispatch({
    type: BudgetActionType.SET_LOADING,
    payload: true,
  });

  try {
    const budgets = await getPaginatedBudgets();
    console.log(budgets);
    const budgetsData = budgets?.data;

    if (budgetsData) {
      dispatch({
        type: BudgetActionType.SET_BUDGETS,
        payload: budgetsData,
      });
    }
  } catch (error) {
    dispatch({
      type: BudgetActionType.SET_BUDGETS,
      payload: [],
    });
  } finally {
    dispatch({
      type: BudgetActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function syncPaginatedBudgets(
  dispatch: Dispatch<BudgetAction>,
  options?: PaginatedParams,
  toGeneral?: boolean,
) {
  dispatch({
    type: BudgetActionType.SET_LOADING,
    payload: true,
  });

  try {
    const paginatedBudgets = await getPaginatedBudgets(options);

    if (toGeneral) {
      const justBudgets = paginatedBudgets.data || [];

      dispatch({
        type: BudgetActionType.SET_BUDGETS,
        payload: justBudgets,
      });
    }

    dispatch({
      type: BudgetActionType.SYNC_PAGINATED,
      payload: paginatedBudgets,
    });
  } catch (error) {
    dispatch({
      type: BudgetActionType.SYNC_PAGINATED,
      payload: initialBudgetState.paginatedBudgets,
    });
  } finally {
    dispatch({
      type: BudgetActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function createBudget(
  dispatch: Dispatch<BudgetAction>,
  budget: CreateBudgetParams,
  state: BudgetState,
) {
  dispatch({
    type: BudgetActionType.SET_LOADING,
    payload: true,
  });

  const currentPaginated = state.paginatedBudgets;
  const currentPage = currentPaginated.meta?.currentPage;
  const currentLimit = currentPaginated.meta?.itemsPerPage;
  const currentBudgets = state.budgets;

  const formattedBudget = formatBudgetData(budget);

  try {
    const { data } = await axiosClient.post('/budget', {
      ...formattedBudget,
    });

    const newBudget: Budget = data.data.budget;

    dispatch({
      type: BudgetActionType.CREATE_BUDGET,
      payload: newBudget,
    });

    dispatch({
      type: BudgetActionType.SET_BUDGETS,
      payload: [newBudget, ...currentBudgets],
    });

    if (currentPage !== 1) {
      syncPaginatedBudgets(dispatch, {
        page: currentPage || 1,
        limit: currentLimit || 30,
        date: new Date(),
      });
    }
  } catch (error) {
    dispatch({
      type: BudgetActionType.CREATE_BUDGET,
      payload: null,
    });
  } finally {
    dispatch({
      type: BudgetActionType.SET_LOADING,
      payload: false,
    });
  }
}

export {
  syncRecentBudgets,
  syncPaginatedBudgets,
  getBudgets,
  createBudget,
};
