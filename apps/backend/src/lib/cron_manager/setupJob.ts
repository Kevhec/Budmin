import { Transaction } from 'sequelize';
import getDateTimeDifference from '../utils/time/getDateTimeDifference';
import { Job, scheduleCronTask } from './taskScheduler';
import {
  TargetType, JobTypes, Target,
  UserAttributes,
} from '../types';
import upsertCronTask from './upsertCronTask';
import upsertCronJob from './upsertCronJob';

interface Params<T> {
  user: UserAttributes
  cronExpression: string
  startDate: Date
  endDate?: Date
  timezone: string
  nextExecutionDate: Date
  particularJobArgs: T
  jobName: JobTypes
  startDateOnly?: boolean
  existingTaskId?: string
  existingJobId?: string
  target: Target<TargetType>
}

async function setupOrUpdateJob<T>(
  {
    user,
    timezone,
    startDate,
    cronExpression,
    endDate,
    nextExecutionDate,
    startDateOnly,
    jobName,
    particularJobArgs,
    existingTaskId,
    existingJobId,
    target,
  }: Params<T>,
  { transaction }: { transaction?: Transaction } = {},
) {
  const intervalMilliseconds = getDateTimeDifference(startDate, nextExecutionDate);

  const newOrUpdatedTaskId = await upsertCronTask({
    user,
    data: {
      cronExpression,
      endDate,
      timezone,
    },
    taskId: existingTaskId,
    target,
  }, { transaction });

  const job = await upsertCronJob({
    user,
    data: {
      jobName,
      jobArgs: {
        ...particularJobArgs,
        intervalMilliseconds: startDateOnly ? null : intervalMilliseconds,
        userId: user?.id || '',
        cronTaskId: newOrUpdatedTaskId,
      },
    },
    taskId: newOrUpdatedTaskId,
    jobId: existingJobId,
  }, { transaction });

  const typedJob = job as unknown as Job;

  await scheduleCronTask({
    cronExpression,
    endDate,
    timezone,
    taskId: newOrUpdatedTaskId,
    jobs: [typedJob],
  }, { transaction });
}

export default setupOrUpdateJob;
