import { RecurrenceType, Ordinals, type ParsedConcurrence } from '../types';
import getWeekDay from '../utils/time/getWeekDay';
/*
Cron expression anatomy

┌──────────── minute
│ ┌────────── hour
│ │ ┌──────── day of month
│ │ │ ┌────── month
│ │ │ │ ┌──── day of week
│ │ │ │ │
│ │ │ │ │
* * * * *
*/

interface Params extends ParsedConcurrence {
  startDate: Date,
}

function getOrdinalIndex(ordinal: Ordinals): number | undefined {
  switch (ordinal) {
    case Ordinals.FIRST:
      return 1;
    case Ordinals.SECOND:
      return 2;
    case Ordinals.THIRD:
      return 3;
    case Ordinals.FOURTH:
      return 4;
    case Ordinals.FIFTH:
      return 5;
    case undefined:
      return undefined;
    default:
      throw new Error(`Unknown ordinal: ${ordinal}`);
  }
}

function generateCronExpression(concurrence: Params) {
  const {
    recurrence,
    weekDay,
    time,
    startDate,
  } = concurrence;
  const { hour, minute } = time;
  const { type, steps } = recurrence;

  let weekDayNumber;
  let ordinalWeekdayNumber;

  if (weekDay?.value) {
    weekDayNumber = getWeekDay(weekDay.value);
  }

  if (weekDay?.ordinal) {
    console.log({ ordinal: weekDay.ordinal });
    ordinalWeekdayNumber = getOrdinalIndex(weekDay.ordinal) || 1;
  }

  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth() + 1;

  // Initialize cron exp with time data
  let cronExpression = `${minute} ${hour} `;

  switch (type) {
    case RecurrenceType.DAILY:
      cronExpression += `*/${steps} * *`;
      break;
    case RecurrenceType.WEEKLY:
      cronExpression += `* * ${weekDayNumber}/${steps}`;
      break;
    case RecurrenceType.MONTHLY:
      cronExpression += `${startDay} */${steps} ${weekDayNumber || '*'}${ordinalWeekdayNumber ? `#${ordinalWeekdayNumber}` : ''}`;
      break;
    case RecurrenceType.SEMESTRIAL: {
      const nextMonth = (startMonth + 6) > 12 ? (startMonth + 6) - 12 : (startMonth + 6);
      cronExpression += `${startDay} ${startMonth},${nextMonth} *`;
      break;
    }
    case RecurrenceType.YEARLY:
      cronExpression += `${startDay} ${startMonth} *`;
      break;
    default:
      throw new Error('Unsupported occurrence type');
  }

  console.log({ cronExpression });

  return cronExpression.trim();
}

export default generateCronExpression;
