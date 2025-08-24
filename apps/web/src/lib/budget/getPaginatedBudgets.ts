import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import type { Budget, PaginatedApiResponse, PaginatedParams } from '@/types';
import { dateStringRegex } from '../constants';
import { isValidDate } from '../utils';

async function getPaginatedBudgets(options?: PaginatedParams) {
  try {
    const params: Record<string, any> = {};

    if (options) {
      const { date, limit = 1, page = 1 } = options;

      let validDate;
      let validOffset = 0;
      let validLimit: number | string = '';

      validOffset = (page - 1) * limit;
      // TODO: Fix this date type issue
      validLimit = limit;

      params.offset = validOffset;
      params.limit = validLimit;

      if (date instanceof Date && isValidDate(date)) {
        validDate = format(date, 'YYYY-MM');
      } else if (date && dateStringRegex.test(String(date))) {
        validDate = date;
      }

      if (validDate) {
        params.month = validDate;
      }
    }

    // TODO: Evaluate if budgets should be obtained by month, start date or creation date
    const { data } = await axiosClient
      .get<PaginatedApiResponse<Budget[]>>(
      '/budget/?balance="true"',
      {
        params,
      },
    );

    return data;
  } catch (error: any) {
    // TODO: Handle errors to avoid error logs for non critical errors
    throw new Error(error);
  }
}

export default getPaginatedBudgets;
