import { CONCURRENCE_TYPE, DEFAULT_CONCURRENCES } from '@/lib/constants';
import type { CreateBudgetParams } from './budget';
import type { CreateTransactionParams } from './transaction';

export type Months =
  'enero' |
  'febrero' |
  'marzo' |
  'abril' |
  'junio' |
  'julio' |
  'agosto' |
  'septiembre' |
  'octubre' |
  'noviembre' |
  'diciembre';

export enum WeekDays {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum Ordinals {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  FOURTH = 'fourth',
  FIFTH = 'fifth',
}

export interface ReducerAction<T, P = undefined> {
  type: T,
  payload: P
}

export type FormProps<T> = {
  onSubmit: (data: T) => void | Promise<void>;
  formId: string
};

export type CreationParamsUnion =
  | CreateBudgetParams
  | CreateTransactionParams;

export type DefaultConcurrency = typeof DEFAULT_CONCURRENCES[number];

export interface SimplifiedConcurrence {
  defaults: DefaultConcurrency
  type: typeof CONCURRENCE_TYPE[number],
  steps: number,
  weekDay: WeekDays,
  time: Date,
  monthSelect: 'exact' | 'ordinal'
  endDate?: Date
  withEndDate: 'true' | 'false'
}

export interface TablePagination {
  pageIndex: number
  pageSize: number
}

export type CreationType = 'transaction' | 'budget';

export interface Message {
  text: string
  type: 'success' | 'error' | 'info'
}

export type MessageResult =
  | 'Success'
  | 'Error'
  | 'Info'
  | 'Warning';

/**
 * D = Domain,
 * A = Action.
 */
export type MessageId<
  D extends string,
  A extends string = never,
> =
  | `${D}${Capitalize<MessageResult>}`
  | `${D}${Capitalize<A>}${Capitalize<MessageResult>}`;

export type AppMessages<T extends string> = Record<T, Message | null>;

export enum BaseActionType {
  SET_LOADING = 'SET_LOADING',
  SET_FINISHED_ASYNC_ACTION = 'SET_FINISHED_ASYNC_ACTION',
  SET_MESSAGE = 'SET_MESSAGE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
  CLEAR_MESSAGES = 'CLEAR_MESSAGES',
}

export type SetMessageAction<T extends string = string> =
  ReducerAction<BaseActionType.SET_MESSAGE, Partial<AppMessages<T>>>;

export type DeleteMessageAction<T extends string = string> =
  ReducerAction<BaseActionType.DELETE_MESSAGE, T | T[]>;

export type ClearMessagesAction =
  ReducerAction<BaseActionType.CLEAR_MESSAGES>;

export type LoadingAction =
  ReducerAction<BaseActionType.SET_LOADING, boolean>;

export type FinishedAsyncAction =
  ReducerAction<BaseActionType.SET_FINISHED_ASYNC_ACTION, boolean>;

export type BaseAction<T extends string = string> =
  | SetMessageAction<T>
  | DeleteMessageAction<T>
  | ClearMessagesAction
  | LoadingAction
  | FinishedAsyncAction;

export interface BaseState<MessageIds extends string = string> {
  messages: Partial<AppMessages<MessageIds>>
  loading: boolean
  finishedAsyncAction: boolean
}

export type MessageIdsOf<State extends BaseState<any>> =
  State extends BaseState<infer MessageIds> ? MessageIds : never;
