import { Concurrence, UserAttributes } from '../types';
import parseConcurrence from '../utils/concurrence/formatConcurrence';
import generateCronExpression from './generateCronExpression';
import generateNextExecutionDate from './generateNextExecutionDate';

function prepareJobData(user: UserAttributes, concurrence: Concurrence, startDate: Date) {
  if (!concurrence || !user) return null;

  const userTimezone = user.preferences?.timezone || 'UTC';
  const parsedConcurrence = parseConcurrence(concurrence, startDate, userTimezone);
  const {
    time,
    endDate,
    weekDay,
  } = parsedConcurrence;

  const { minute, hour, timezone } = time;
  const { steps, type } = concurrence;

  const cronExpression = generateCronExpression({
    recurrence: {
      type,
      steps,
    },
    startDate,
    time: {
      minute,
      hour,
      timezone,
    },
    weekDay,
  });

  const nextExecutionDate = generateNextExecutionDate(cronExpression, { tz: timezone });

  return {
    cronExpression,
    concurrenceEndDate: endDate,
    nextExecutionDate,
    timezone,
  };
}

export default prepareJobData;
