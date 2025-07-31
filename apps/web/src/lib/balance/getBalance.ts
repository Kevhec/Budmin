import axiosClient from '@/config/axios';
import type { BalanceData } from '@types';
import { dateStringRegex } from '../constants';

async function getBalance(from?: string, to?: string) {
  if (from && !dateStringRegex.test(from)) {
    throw new Error(`Badly formatted date string: ${from}, should follow format YYYY-MM`);
  }

  if (to && !dateStringRegex.test(to)) {
    throw new Error(`Badly formatted date string: ${to}, should follow format YYYY-MM`);
  }

  try {
    const baseUrl = `${import.meta.env.VITE_API_BASEURL}/transaction/balance`;

    const url = new URL(baseUrl);

    if (from) url.searchParams.append('from', from);
    if (to) url.searchParams.append('to', to);

    const { data } = await axiosClient.get(url.toString());

    return data.data as BalanceData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getBalance;
