import { dateStringRegex } from '../constants';
import cliTheme from './chalk';
import { extractYearAndMonth } from './time';

interface Params {
  fromDate?: string
  toDate?: string
  untilToday?: boolean
}

export default function generateDateRange({ fromDate, toDate, untilToday }: Params) {
  // Verify YYYY-MM format
  [fromDate, toDate].forEach((param, i) => {
    if (param === undefined) return;

    if (!dateStringRegex.test(param)) {
      throw new Error(`${cliTheme.serverWarn('[ERROR]:')} Badly formatted param: ${i === 0 ? 'fromDate' : 'toDate'}, should satisfy format YYYY-MM, received ${fromDate} ${toDate}`);
    }
  });

  const parsedFrom = extractYearAndMonth(fromDate);
  const parsedTo = extractYearAndMonth(toDate);
  let start;
  let end;

  if (parsedFrom) {
    const [fromYear, fromMonth] = parsedFrom;

    // Start on provided month on first day
    // Remember January === 0
    start = new Date(fromYear, fromMonth - 1, 1);

    if (!parsedTo) {
      // If not "to" date do and if untilToday is true
      // go to today date else go to last day of same month
      end = untilToday ? new Date() : new Date(start);
      end.setMonth(end.getMonth() + 1, 0);
    } else {
      // If to date use it's month on it's last day
      const [toYear, toMonth] = parsedTo;

      end = new Date(toYear, toMonth, 0);
    }
  }

  // If none is provided use current month
  if (!fromDate && !toDate) {
    start = new Date();
    start.setDate(1);

    end = new Date(start);
    end.setMonth(end.getMonth() + 1, 0);
  }

  return [start, end];
}
