import { Ordinals, type SimplifiedConcurrence, WeekDays } from './common';
import { OccurrenceType } from './recurrence';
import type { TransactionType } from './transaction';

export interface ApiResponse<T> {
  status: string
  data: T
}

export interface PaginationMeta {
  totalItems: number,
  itemCount: number,
  itemsPerPage: number,
  totalPages: number,
  currentPage: number,
}

export interface PaginationLinks {
  first?: string,
  previous?: string,
  next?: string,
  last?: string,
}

export interface PaginatedApiResponse<T> {
  status?: number,
  data?: T,
  meta?: PaginationMeta,
  links?: PaginationLinks,
}

export enum PaginationAction {
  NEXT = 'next',
  PREV = 'prev',
  FIRST = 'first',
  LAST = 'last',
  PAGE = 'page',
}

export interface GetPaginatedParams {
  links: LinksData
  meta: MetaData
  action: PaginationAction
  page?: number
}

export type LinksData = PaginatedApiResponse<any>['links'];

export type MetaData = PaginatedApiResponse<any>['meta'];

export interface ApiError {
  status: string
  error: string
}

export interface ApiMessage {
  message: string
}

export type MessageResponse = ApiResponse<ApiMessage>;

export interface ApiRecurrence {
  recurrence: {
    type: OccurrenceType
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

export interface ApiBudget {
  name: string
  totalAmount: number
  startDate: Date
  endDate?: Date
  concurrence?: SimplifiedConcurrence
}

export interface ApiTransaction {
  description: string
  amount: number
  startDate: Date
  type: TransactionType
  budgetId?: string
  categoryId?: string
  concurrence?: SimplifiedConcurrence
}
