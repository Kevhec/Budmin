import { initialPaginatedState } from '@/lib/constants';
import { updateArrayItem } from '@/lib/utils';
import type {
  PaginatedApiResponse,
  Transaction, TransactionAction, TransactionState,
} from '@/types';
import { TransactionActionType } from '@/types';

const initialRecentTransactionsState: Transaction[] = [];

const initialTransactionState: TransactionState = {
  recentTransactions: initialRecentTransactionsState,
  balance: {},
  paginatedTransactions:
    initialPaginatedState as PaginatedApiResponse<Transaction[]>,
  loading: false,
};

function transactionReducer(
  state: TransactionState,
  action: TransactionAction,
): TransactionState {
  switch (action.type) {
    case TransactionActionType.SYNC_RECENT:
      return ({
        ...state,
        recentTransactions: action.payload,
      });
    case TransactionActionType.SYNC_PAGINATED:
      return ({
        ...state,
        paginatedTransactions: action.payload,
      });
    case TransactionActionType.CREATE_TRANSACTION: {
      const newTransaction = action.payload;

      if (!newTransaction) {
        return state;
      }

      const currentPaginated = state.paginatedTransactions;
      const isFirstPage = currentPaginated.meta?.currentPage === 1;

      const updatedRecentTransactions = [newTransaction, ...state.recentTransactions].slice(0, 4);

      /* TODO: Handle case when page is not the first one
        it should trigger a sync for paginated data
      */
      const newPaginatedData = isFirstPage && currentPaginated.data
        ? [
          newTransaction,
          ...currentPaginated.data,
        ]?.slice(0, currentPaginated.meta?.itemsPerPage || 30)
        : currentPaginated.data;

      const updatedPaginatedTransactions = {
        ...currentPaginated,
        data: newPaginatedData,
      };

      return ({
        ...state,
        recentTransactions: updatedRecentTransactions,
        paginatedTransactions: updatedPaginatedTransactions,
      });
    }
    case TransactionActionType.GET_BALANCE:
      return ({
        ...state,
        balance: action.payload,
      });
    case TransactionActionType.UPDATE_TRANSACTION: {
      const updatedTransaction = action.payload;

      if (!updatedTransaction) {
        return { ...state };
      }

      const updatedRecent = updateArrayItem(
        state.recentTransactions,
        updatedTransaction.id,
        updatedTransaction,
      );

      const updatedPaginatedData = updateArrayItem(
        state.paginatedTransactions.data || [],
        updatedTransaction.id,
        updatedTransaction,
      );

      const updatedPaginated = {
        ...state.paginatedTransactions,
        data: updatedPaginatedData,
      };

      return ({
        ...state,
        recentTransactions: updatedRecent,
        paginatedTransactions: updatedPaginated,
      });
    }
    case TransactionActionType.SET_LOADING:
      return ({
        ...state,
        loading: action.payload,
      });
    default:
      return state;
  }
}

export {
  transactionReducer,
  initialTransactionState,
  initialRecentTransactionsState,
};
