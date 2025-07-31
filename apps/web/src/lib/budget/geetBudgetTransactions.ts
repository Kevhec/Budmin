import type { Transaction } from '@/types';
import axiosClient from '@/config/axios';
import type { PaginatedApiResponse } from '@/types/api';

async function getBudgetTransactions(budgetId: string) {
  try {
    const { data } = await axiosClient<PaginatedApiResponse<Transaction[]>>(
      `/budget/${budgetId}/transactions`,
    );

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getBudgetTransactions;
