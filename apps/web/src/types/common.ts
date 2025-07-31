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

export type LoadingAction<T> =
  ReducerAction<T, boolean>;

export type FinishedAsyncAction<T> =
  ReducerAction<T, boolean>;

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
