import { type Dispatch } from 'react';
import { getPaginatedTransactions } from '@/lib/transaction';
import type {
  CreateTransactionParams,
  PaginatedParams, Transaction, TransactionAction,
  TransactionState,
} from '@/types';
import { TransactionActionType } from '@/types';
import axiosClient from '@/config/axios';
import getBalance from '@/lib/balance/getBalance';
import formatTransactionData from '@/lib/transaction/formatTransactionData';
import getPaginationOptions from '@/lib/transaction/getPaginationOptions';
import { initialRecentTransactionsState, initialTransactionState } from './transactionReducer';

// TODO! When there are not paginated transaction in the history page,
// TODO! it start making requests in an infinite loop

async function syncRecentTransactions(dispatch: Dispatch<TransactionAction>) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });

  try {
    const response = await getPaginatedTransactions({
      page: 1,
      limit: 4,
      include: 'budget,category,concurrence',
    });

    const recentTransactions = response.data;

    console.log({ recentTransactions });

    if (recentTransactions) {
      dispatch({
        type: TransactionActionType.SYNC_RECENT,
        payload: recentTransactions,
      });
    }
  } catch (error) {
    dispatch({
      type: TransactionActionType.SYNC_RECENT,
      payload: initialRecentTransactionsState,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function syncPaginatedTransactions(
  dispatch: Dispatch<TransactionAction>,
  options: PaginatedParams,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });
  try {
    const paginatedTransactions = await getPaginatedTransactions(options);

    dispatch({
      type: TransactionActionType.SYNC_PAGINATED,
      payload: paginatedTransactions,
    });
  } catch (error) {
    dispatch({
      type: TransactionActionType.SYNC_PAGINATED,
      payload: initialTransactionState.paginatedTransactions,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function createTransaction(
  dispatch: Dispatch<TransactionAction>,
  transaction: CreateTransactionParams,
  state: TransactionState,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });

  const currentPaginated = state.paginatedTransactions;
  const currentPage = currentPaginated.meta?.currentPage;
  const currentLimit = currentPaginated.meta?.itemsPerPage;

  const formattedTransaction = formatTransactionData(transaction);

  try {
    const { data } = await axiosClient.post('/transaction', {
      ...formattedTransaction,
    });

    const newTransaction: Transaction = data.data.transaction;

    dispatch({
      type: TransactionActionType.CREATE_TRANSACTION,
      payload: newTransaction,
    });

    console.log({ newTransaction });

    if (currentPage !== 1) {
      syncPaginatedTransactions(dispatch, getPaginationOptions({
        currentPage,
        currentLimit,
      }));
    }
  } catch (error) {
    // TODO!: ERROR HANDLING
    console.log(error);
    dispatch({
      type: TransactionActionType.CREATE_TRANSACTION,
      payload: null,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function getHistoricalBalance(
  dispatch: Dispatch<TransactionAction>,
  from?: string,
  to?: string,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });

  try {
    const balance = await getBalance(from, to);

    dispatch({
      type: TransactionActionType.GET_BALANCE,
      payload: balance || {},
    });
  } catch (error) {
    dispatch({
      type: TransactionActionType.GET_BALANCE,
      payload: {},
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function updateTransaction(
  dispatch: Dispatch<TransactionAction>,
  transaction: CreateTransactionParams,
  id: string,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });
  try {
    const formattedTransaction = formatTransactionData(transaction);

    const query = new URLSearchParams([
      ['include', 'budget,category,concurrence'],
    ]);

    const { data } = await axiosClient.patch(`/transaction/${id}`, {
      ...formattedTransaction,
    }, { params: query });

    dispatch({
      type: TransactionActionType.UPDATE_TRANSACTION,
      payload: data.data,
    });
  } catch (error) {
    dispatch({
      type: TransactionActionType.UPDATE_TRANSACTION,
      payload: null,
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

async function deleteTransaction(
  dispatch: Dispatch<TransactionAction>,
  id: string,
  state: TransactionState,
) {
  dispatch({
    type: TransactionActionType.SET_LOADING,
    payload: true,
  });
  try {
    const { data } = await axiosClient.delete(`/transaction/${id}`);

    const { deletedTransactionId } = data.data;

    if (!deletedTransactionId) return;

    const paginatedOptions = getPaginationOptions({
      currentPage: state.paginatedTransactions.meta?.currentPage,
      currentLimit: state.paginatedTransactions.meta?.itemsPerPage,
    });

    await syncPaginatedTransactions(dispatch, paginatedOptions);
    await syncRecentTransactions(dispatch);
  } catch (error) {
    dispatch({
      type: TransactionActionType.DELETE_TRANSACTION,
      payload: {
        deletedTransactionId: '',
      },
    });
  } finally {
    dispatch({
      type: TransactionActionType.SET_LOADING,
      payload: false,
    });
  }
}

export {
  syncRecentTransactions,
  syncPaginatedTransactions,
  createTransaction,
  getHistoricalBalance,
  updateTransaction,
  deleteTransaction,
};
