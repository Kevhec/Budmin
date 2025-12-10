import { z } from 'zod';
import { type Request } from 'express';
import { InferAttributes } from 'sequelize';
import { type TransactionType } from '../database/models/transaction';
import { concurrenceSchema } from '../database/schemas/general';
import { CONCURRENCE_TYPE, DEFAULT_CONCURRENCES } from './constants';
import type UserPreferences from '../database/models/userPreferences';
import type {
  Budget,
  Category,
  Page,
  User,
  Transaction,
  Concurrence as ConcurrenceModel,
  CronJob,
  CronTask,
} from '../database/models';

export interface BalanceResponse {
  year: string
  month: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface TypedRequest<T> extends Request {
  body: T
}

export type MonthData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SEMESTRIAL = 'semestrial',
  YEARLY = 'yearly',
}

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

export interface TimeRecurrence {
  hour: number
  minute: number
  timezone: string
}

export type YearData = Record<string, MonthData>;

export type BalanceData = Record<string, YearData>;

export type Concurrence = z.infer<typeof concurrenceSchema>;

export interface CreateBudgetParams {
  name: string,
  totalAmount: number,
  startDate: Date,
  endDate?: Date,
  intervalMilliseconds?: number
  datesOffset?: string | number
  userId: string,
}

export enum JobTypes {
  CREATE_BUDGET = 'create-budget',
  CREATE_TRANSACTION = 'create-transaction',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JobParams<M extends Record<string, (...args: any) => any>> = {
  [K in keyof M]: Parameters<M[K]>[0];
}[keyof M];

export interface CreateBudgetRequestBody {
  name: string
  totalAmount: number
  startDate: string
  endDate: string
  concurrence: Concurrence
}

export interface CreateTransactionRequestBody {
  description: string
  amount: number
  startDate: string
  type: TransactionType
  budgetId?: string
  categoryId: string
  concurrence: Concurrence
}

export interface CreateUserRequestBody {
  email: string
  username: string
  birthday: string
  password: string
  repeatPassword: string
  timezone: string
}

export interface CreateTransactionParams {
  description: string
  amount: number
  startDate: Date
  type: TransactionType
  budgetId?: string
  categoryId: string
  userId: string
}

export type DefaultConcurrency = typeof DEFAULT_CONCURRENCES[number];

export interface ConcurrenceFormData {
  concurrenceDefault: DefaultConcurrency
  concurrenceType: typeof CONCURRENCE_TYPE[number],
  concurrenceSteps: number,
  concurrenceWeekDay: WeekDays,
  concurrenceTime: Date,
  concurrenceMonthSelect: 'exact' | 'ordinal'
  concurrenceEndDate?: Date
  concurrenceWithEndDate: 'true' | 'false'
}

export interface ParsedConcurrence {
  recurrence: {
    type: typeof CONCURRENCE_TYPE[number]
    steps: number
  }
  weekDay?: {
    value?: WeekDays
    ordinal?: Ordinals
  }
  time: {
    hour: number
    minute: number
    timezone: string
  }
  endDate?: Date
}

export enum DefaultConcurrences {
  NONE = 'none',
  CUSTOM = 'custom',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum ConcurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SEMESTRIAL = 'semestrial',
  YEARLY = 'yearly',
}

export enum WithEndDate {
  TRUE = 'true',
  FALSE = 'false',
}

export enum MonthSelect {
  EXACT = 'exact',
  ORDINAL = 'ordinal',
}

export interface Models {
  User: typeof User
  UserPreferences: typeof UserPreferences,
  Budget: typeof Budget
  Concurrence: typeof ConcurrenceModel
  CronJob: typeof CronJob
  CronTask: typeof CronTask
  Transaction: typeof Transaction
  Category: typeof Category
  Page: typeof Page
}

export enum TargetType {
  TRANSACTION = 'Transaction',
  BUDGET = 'Budget',
}

export interface Target<T> {
  id: string,
  type: T
}

export type UserAttributes = InferAttributes<User>;
