import { budgetReducer, initialBudgetState } from '@/reducers/budget/budgetReducer';
import type { CreateBudgetParams, PaginatedParams } from '@/types';
import {
  createContext, useCallback, useEffect, useMemo, useReducer,
} from 'react';
import type { BudgetContextType } from '@/types/budget';
import {
  createBudget as createBudgetAction,
  syncPaginatedBudgets as syncPaginatedBudgetsAction,
  syncRecentBudgets as syncRecentBudgetsAction,
  getBudgets as getBudgetsAction,
} from '@/reducers/budget/budgetActions';

export const BudgetContext = createContext<BudgetContextType | null>(null);

function BudgetProvider({ children }: React.PropsWithChildren) {
  const [
    state,
    dispatch,
  ] = useReducer(budgetReducer, initialBudgetState);

  const createBudget = useCallback((data: CreateBudgetParams) => {
    createBudgetAction(dispatch, data, state);
  }, [state]);

  const getBudgets = useCallback(() => {
    getBudgetsAction(dispatch);
  }, []);

  const getPaginatedBudgets = useCallback((options: PaginatedParams) => {
    syncPaginatedBudgetsAction(dispatch, options, true);
  }, []);

  const updateRecentBudgets = useCallback(() => {
    syncRecentBudgetsAction(dispatch);
  }, []);

  const contextValue = useMemo<BudgetContextType>(() => ({
    state,
    getBudgets,
    getPaginatedBudgets,
    createBudget,
    updateRecentBudgets,
  }), [state, createBudget, getBudgets, getPaginatedBudgets, updateRecentBudgets]);

  useEffect(() => {
    updateRecentBudgets();
    getBudgets();
  }, [getBudgets, updateRecentBudgets]);

  return (
    <BudgetContext.Provider value={contextValue}>
      { children }
    </BudgetContext.Provider>
  );
}

export default BudgetProvider;
