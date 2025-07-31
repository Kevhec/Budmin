import type { ApiTransaction, CreateTransactionParams, TransactionType } from '@/types';
import { extractConcurrenceData } from '../utils';

function formatTransactionData(transaction: CreateTransactionParams) {
  const concurrenceFormData = extractConcurrenceData(transaction);

  const formattedTransaction: ApiTransaction = {
    description: transaction.description,
    amount: transaction.amount,
    startDate: transaction.startDate,
    type: transaction.type as TransactionType,
    budgetId: transaction.budgetId,
    categoryId: transaction.categoryId,
    concurrence: concurrenceFormData,
  };

  return formattedTransaction;
}

export default formatTransactionData;
