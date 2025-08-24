import {
  createContext, type PropsWithChildren, useCallback, useEffect, useMemo, useReducer,
} from 'react';
import type { CategoriesContextType } from '@/types';
import { categoryReducer, initialCategoriesState } from '@/reducers/category/categoryReducer';
import {
  syncCategories as syncCategoriesAction,
  getBalance as getBalanceAction,
} from '@/reducers/category/categoryActions';
import { getItem } from '@/lib/localStorage';
import { formatYearMonthDate } from '@/lib/utils';

export const CategoriesContext = createContext<CategoriesContextType | null>(null);

function CategoriesProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoriesState);

  const updateBalance = useCallback(({ year, month }: { year?: number, month?: number }) => {
    const date = formatYearMonthDate({ year, month });

    getBalanceAction(dispatch, date);
  }, []);

  useEffect(() => {
    const year = getItem<number>('dashboard-year');
    const month = getItem<number>('dashboard-month');
    const date = formatYearMonthDate({ year, month });

    syncCategoriesAction(dispatch);
    getBalanceAction(dispatch, date);
  }, []);

  const contextValue = useMemo(() => ({
    state,
    updateBalance,
  }), [state, updateBalance]);

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;
