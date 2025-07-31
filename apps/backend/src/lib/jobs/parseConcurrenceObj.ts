import {
  Concurrence, DefaultConcurrences, MonthSelect, WeekDays,
} from '../types';

function parseConcurrenceObj(concurrence: Concurrence) {
  return {
    ...concurrence,
    defaults: concurrence.defaults as DefaultConcurrences,
    weekDay: concurrence.weekDay as WeekDays,
    monthSelect: concurrence.monthSelect as MonthSelect,
    endDate: concurrence.endDate ? new Date(concurrence.endDate) : undefined,
    time: new Date(concurrence.time),
    withEndDate: concurrence.withEndDate === 'true',
  };
}

export default parseConcurrenceObj;
