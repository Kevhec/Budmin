import { z } from 'zod';
import axiosClient from '@/config/axios';
import { transactionSchema } from '@/schemas/creation';
import type { Transaction } from '@/types';

type Params = z.infer<typeof transactionSchema>;

async function createTransaction(transaction: Params): Promise<Transaction | null> {
  try {
    const { data } = await axiosClient.post('/transaction', {
      ...transaction,
    });

    const newTransaction: Transaction = data.data.transaction;

    return newTransaction;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default createTransaction;
