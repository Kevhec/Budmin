import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import type { PaginatedApiResponse, PaginatedParams, Transaction } from '@/types';

async function getPaginatedTransactions({
  page = 1,
  limit = 4,
  date,
  presetUrl,
  include,
}: PaginatedParams) {
  try {
    let queryYear = '';
    let queryMonth = '';

    if (date) {
      const [dateYear, dateMonth] = format(date, 'YYYY-MM').split('-');

      queryYear = dateYear;
      queryMonth = dateMonth;
    }
    const offset = (page - 1) * (limit);

    const requestUrl = presetUrl || '/transaction/';

    const queryParams = presetUrl ? null : new URLSearchParams([
      ['offset', String(offset)],
      ['limit', String(limit)],
      ['month', date ? `${queryYear}-${queryMonth}` : ''],
      include ? ['include', include] : [],
    ]);

    const { data } = await axiosClient
      .get<PaginatedApiResponse<Transaction[]>>(requestUrl, {
      params: queryParams,
    });

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getPaginatedTransactions;
