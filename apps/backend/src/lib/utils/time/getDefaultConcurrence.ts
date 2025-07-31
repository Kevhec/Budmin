import { format } from '@formkit/tempo';
import {
  ParsedConcurrence, DefaultConcurrency, RecurrenceType, Ordinals, WeekDays,
} from '../../types';
import { ENGLISH_ORDINALS } from '../../constants';

interface Params {
  type: Exclude<DefaultConcurrency, 'none' | 'custom'>
  startDate: Date
  timezone: string
  ordinalIndex: number
}

function getDefaultRecurrence({
  type,
  startDate,
  timezone,
  ordinalIndex,
}: Params) {
  const timeDefinition = {
    hour: startDate.getHours(),
    minute: startDate.getMinutes(),
    timezone,
  };

  const weekDayName = format(startDate, 'dddd', 'en').toLowerCase() as WeekDays;

  const defaultMapping: Record<Exclude<DefaultConcurrency, 'none' | 'custom'>, ParsedConcurrence> = {
    daily: {
      recurrence: {
        type: RecurrenceType.DAILY,
        steps: 1,
      },
      time: timeDefinition,
    },
    weekly: {
      recurrence: {
        type: RecurrenceType.WEEKLY,
        steps: 1,
      },
      weekDay: {
        value: weekDayName,
      },
      time: timeDefinition,
    },
    monthly: {
      recurrence: {
        type: RecurrenceType.MONTHLY,
        steps: 1,
      },
      weekDay: {
        value: weekDayName,
        ordinal: ENGLISH_ORDINALS[ordinalIndex] as Ordinals,
      },
      time: timeDefinition,
    },
    yearly: {
      recurrence: {
        type: RecurrenceType.YEARLY,
        steps: 1,
      },
      time: timeDefinition,
    },
  };

  return defaultMapping[type];
}

export default getDefaultRecurrence;
