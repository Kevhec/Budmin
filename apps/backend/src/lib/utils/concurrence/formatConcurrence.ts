import { format } from '@formkit/tempo';
import {
  ParsedConcurrence, RecurrenceType, Ordinals, Concurrence, WeekDays,
} from '../../types';
import { ENGLISH_ORDINALS } from '../../constants';
import getDayOrdinalNumber from '../time/getDayOrinalNumber';
import getDefaultRecurrence from '../time/getDefaultConcurrence';

function parseConcurrence(
  concurrence: Concurrence,
  startDate: Date,
  timezone: string,
): ParsedConcurrence {
  const {
    defaults,
    type,
    steps,
    weekDay,
    time,
    monthSelect,
    endDate,
  } = concurrence;

  const weekDayOrdinalIndex = getDayOrdinalNumber(startDate.getDate()) - 1;

  if (
    defaults !== 'custom'
  ) {
    const defaultRecurrence = getDefaultRecurrence({
      type: defaults,
      startDate,
      timezone,
      ordinalIndex: weekDayOrdinalIndex,
    });

    return defaultRecurrence;
  }

  const [hour, minute] = format(time || new Date(), 'H-m')
    .split('-')
    .map(Number);

  const monthOrdinalCheck = type === 'monthly' && monthSelect === 'ordinal';

  const hasWeekDay = (
    type === 'weekly'
    || monthOrdinalCheck
  );

  const ordinal = monthOrdinalCheck
    ? ENGLISH_ORDINALS[weekDayOrdinalIndex] as Ordinals
    : undefined;

  console.log({ ordinal });

  const recurrence: ParsedConcurrence = {
    recurrence: {
      type: type as RecurrenceType,
      steps: steps || 1,
    },
    weekDay: {
      value: hasWeekDay ? weekDay as WeekDays : undefined,
      ordinal,
    },
    time: {
      hour,
      minute,
      timezone,
    },
    endDate: endDate ? new Date(endDate) : undefined,
  };

  return recurrence;
}

export default parseConcurrence;
