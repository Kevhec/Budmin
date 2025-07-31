import { BudgetContext } from '@/context/BudgetProvider';
import { useContext } from 'react';

function useBudgets() {
  const budgetsContext = useContext(BudgetContext);
  if (budgetsContext === undefined || budgetsContext === null) {
    throw new Error('useBudgets must be used within an BudgetProvider');
  }
  return budgetsContext;
}

export default useBudgets;
