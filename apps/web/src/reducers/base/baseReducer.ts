import {
  BaseActionType, type BaseAction, type BaseState, type MessageIdsOf,
} from '@/types';

export const defaultBaseState: BaseState = {
  loading: true,
  messages: {},
  finishedAsyncAction: false,
};

function createBaseReducer<
  State extends BaseState<string>,
  Action,
>(
  domainReducer: (state: State, action: Action | BaseAction<MessageIdsOf<State>>) => State,
) {
  return function combinedReducer(
    state: State,
    action: Action | BaseAction<MessageIdsOf<State>>,
  ): State {
    const baseAction = action as BaseAction<MessageIdsOf<State>>;

    switch (baseAction.type) {
      case BaseActionType.SET_MESSAGE:
        return ({
          ...state,
          messages: {
            ...state.messages,
            ...baseAction.payload,
          },
        });
      case BaseActionType.DELETE_MESSAGE: {
        const keys = Array.isArray(baseAction.payload)
          ? baseAction.payload
          : [baseAction.payload];

        const rest = { ...state.messages };

        keys.forEach((key) => {
          delete rest[key];
        });

        return ({
          ...state,
          messages: rest,
        });
      }
      case BaseActionType.CLEAR_MESSAGES:
        return ({
          ...state,
          messages: {},
        });
      case BaseActionType.SET_LOADING:
        return ({
          ...state,
          loading: baseAction.payload,
        });
      case BaseActionType.SET_FINISHED_ASYNC_ACTION:
        return ({
          ...state,
          finishedAsyncAction: baseAction.payload,
        });
      default:
        return domainReducer(state, baseAction);
    }
  };
}

export default createBaseReducer;
