import axiosClient from '@/config/axios';
import type { BalanceData } from '@types';
import { dateStringRegex } from '../constants';

// TODO: Make this a named function very pleaseeeeeeeeee
async function getBalance(from?: string, to?: string, sameMonth?: boolean) {
  if (from && !dateStringRegex.test(from)) {
    throw new Error(`Badly formatted date string: ${from}, should follow format YYYY-MM`);
  }

  if (to && !dateStringRegex.test(to)) {
    throw new Error(`Badly formatted date string: ${to}, should follow format YYYY-MM`);
  }

  try {
    const baseUrl = `${import.meta.env.VITE_API_BASEURL}/transaction/balance`;

    const url = new URL(baseUrl);

    if (to) url.searchParams.append('to', to);
    if (from) {
      url.searchParams.append('from', from);
      if (sameMonth) url.searchParams.set('to', from);
    }

    const { data } = await axiosClient.get(url.toString());

    return data.data as BalanceData;
  } catch (error) {
    // TODO: Handle error
    console.log(error);
    return null;
  }
}

export default getBalance;
