import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import type { PaginatedApiResponse, PaginatedParams, Transaction } from '@/types';
import { isValidDate } from '../utils';
import { dateStringRegex } from '../constants';

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

    if (date instanceof Date && isValidDate(date)) {
      const [dateYear, dateMonth] = format(date, 'YYYY-MM').split('-');

      queryYear = dateYear;
      queryMonth = dateMonth;
    } else if (typeof date === 'string' && dateStringRegex.test(date)) {
      const [year, month] = date.split('-');
      queryYear = year;
      queryMonth = month;
    }

    const offset = (page - 1) * (limit);

    const requestUrl = presetUrl || '/transaction/';

    /* TODO: Handle include param to be received as
    an array of strings instead of a comma separated one */
    const params = {
      offset: String(offset),
      limit: String(limit),
      month: date ? `${queryYear}-${queryMonth}` : undefined,
      include: include || undefined,
    };

    const { data } = await axiosClient
      .get<PaginatedApiResponse<Transaction[]>>(requestUrl, {
      params,
    });

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getPaginatedTransactions;
