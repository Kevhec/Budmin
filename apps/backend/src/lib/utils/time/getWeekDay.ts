import { WeekDays } from '@lib/types';

function getWeekDay(day: WeekDays) {
  const weekDayMap: Record<WeekDays, number> = {
    [WeekDays.SUNDAY]: 0,
    [WeekDays.MONDAY]: 1,
    [WeekDays.TUESDAY]: 2,
    [WeekDays.WEDNESDAY]: 3,
    [WeekDays.THURSDAY]: 4,
    [WeekDays.FRIDAY]: 5,
    [WeekDays.SATURDAY]: 6,
  };

  return weekDayMap[day];
}

export default getWeekDay;
