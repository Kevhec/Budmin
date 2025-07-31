import type { CategoryAction, CategoryState } from '@/types';
import { CategoryActionType } from '@/types';

const initialCategoriesState = {
  categories: [],
  loading: false,
  monthBalance: null,
};

function categoryReducer(state: CategoryState, action: CategoryAction) {
  switch (action.type) {
    case CategoryActionType.SYNC_CATEGORIES:
      return ({
        ...state,
        categories: action.payload,
        loading: false,
      });
    case CategoryActionType.SET_LOADING:
      return ({
        ...state,
        loading: action.payload,
      });
    case CategoryActionType.GET_BALANCE:
      return ({
        ...state,
        monthBalance: action.payload,
      });
    default:
      return state;
  }
}

export {
  categoryReducer,
  initialCategoriesState,
};
