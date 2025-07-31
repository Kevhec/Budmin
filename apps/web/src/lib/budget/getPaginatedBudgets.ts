import { format } from '@formkit/tempo';
import axiosClient from '@/config/axios';
import type { Budget, PaginatedApiResponse, PaginatedParams } from '@/types';

async function getPaginatedBudgets(options?: PaginatedParams) {
  try {
    let params: any;

    if (options) {
      let validOffset = 0;
      let validDate = new Date();
      let validLimit: number | string = '';

      const { date, limit = 1, page = 1 } = options;

      validOffset = (page - 1) * limit;
      validDate = date || new Date();
      validLimit = limit;

      const [year, month] = format(validDate || new Date(), 'YYYY-MM').split('-');

      params = {
        offset: validOffset,
        limit: validLimit,
        month: `${year}-${month}`,
      };
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
