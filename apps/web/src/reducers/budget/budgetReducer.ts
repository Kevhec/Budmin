import { initialPaginatedState } from '@/lib/constants';
import type {
  Budget, BudgetAction, BudgetState, PaginatedApiResponse,
} from '@/types';

import { BudgetActionType } from '@/types';

const initialRecentBudgetsState: Budget[] = [];

const initialBudgetState = {
  recentBudgets: initialRecentBudgetsState,
  paginatedBudgets:
    initialPaginatedState as PaginatedApiResponse<Budget[]>,
  budgets: [] as Budget[],
  loading: false,
};

function budgetReducer(state: BudgetState, action: BudgetAction) {
  switch (action.type) {
    case BudgetActionType.SYNC_RECENT:
      return ({
        ...state,
        recentBudgets: action.payload,
      });
    case BudgetActionType.SYNC_PAGINATED:
      return ({
        ...state,
        paginatedBudgets: action.payload,
        loading: false,
      });
    case BudgetActionType.SET_BUDGETS:
      return ({
        ...state,
        budgets: action.payload,
        loading: false,
      });
    case BudgetActionType.CREATE_BUDGET: {
      const newBudget = action.payload;

      if (!newBudget) return state;

      const currentPaginated = state.paginatedBudgets;
      const isFirstPage = currentPaginated.meta?.currentPage === 1;

      const updatedRecentBudgets = [newBudget, ...state.recentBudgets].slice(0, 4);

      const newPaginatedData = isFirstPage && currentPaginated.data
        ? [
          newBudget,
          ...currentPaginated.data,
        ]?.slice(0, currentPaginated.meta?.itemsPerPage || 30)
        : currentPaginated.data;

      const updatedPaginatedBudgets = {
        ...currentPaginated,
        data: newPaginatedData,
      };

      return ({
        ...state,
        recentBudgets: updatedRecentBudgets,
        paginatedBudgets: updatedPaginatedBudgets,
      });
    }
    case BudgetActionType.SET_LOADING:
      return ({
        ...state,
        loading: action.payload,
      });
    default:
      return state;
  }
}

export {
  budgetReducer,
  initialBudgetState,
  initialRecentBudgetsState,
};
