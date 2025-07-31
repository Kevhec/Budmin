import { useContext } from 'react';
import { TransactionsContext } from '@/context/TransactionProvider';

function useTransactions() {
  const transactionContext = useContext(TransactionsContext);
  if (transactionContext === undefined || transactionContext === null) {
    throw new Error('useTransactions must be used within an TransactionsProvider');
  }
  return transactionContext;
}

export default useTransactions;
