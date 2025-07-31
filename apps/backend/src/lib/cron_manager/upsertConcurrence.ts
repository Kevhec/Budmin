import Concurrence from '@/src/database/models/concurrence';
import CronTask from '@/src/database/models/cronTask';
import CronJob from '@/src/database/models/cronJobs';
import type { Transaction as TransactionType } from 'sequelize';
import setupOrUpdateJob from './setupJob';
import {
  createConcurrence as createConcurrenceJob,
} from '../jobs';
import {
  TargetType, JobTypes, JSONValue, Target, type Concurrence as ConcurrenceType,
  UserAttributes,
} from '../types';
import { stopCronTask } from './taskScheduler';
import parseConcurrenceObj from '../jobs/parseConcurrenceObj';

interface Params {
  user: UserAttributes
  target: Target<TargetType>
  concurrence: ConcurrenceType
  startDate: Date
  endDate?: Date
  jobName: JobTypes
  jobArgs: JSONValue
  cronExpression: string
  timezone: string
  nextExecutionDate: Date
  startDateOnly?: boolean
  prevConcurrenceId?: string | null
  prevCronTaskId?: string | null
}

async function upsertConcurrence(
  {
    user,
    target,
    jobName,
    jobArgs,
    concurrence,
    startDate,
    endDate,
    cronExpression,
    timezone,
    nextExecutionDate,
    startDateOnly = false,
    prevConcurrenceId,
    prevCronTaskId,
  }: Params,
  { transaction }: { transaction?: TransactionType } = {},
): Promise<void> {
  try {
    // Add concurrence to existing non-concurrent element
    if (!prevConcurrenceId || !prevCronTaskId) {
      await createConcurrenceJob({
        concurrence,
        user,
        target,
      }, { transaction });

      await setupOrUpdateJob({
        user,
        startDate,
        startDateOnly,
        endDate,
        jobName,
        particularJobArgs: jobArgs,
        target,
        cronExpression,
        timezone,
        nextExecutionDate,
      }, { transaction });
    } else {
      // Modify existing concurrence data
      const associatedConcurrence = await Concurrence.findByPk(prevConcurrenceId, { transaction });
      const associatedTask = await CronTask.findByPk(prevCronTaskId, { transaction });
      const associatedJob = await CronJob.findOne({
        where: {
          userId: user.id,
          cronTaskId: associatedTask?.id,
          jobName: JobTypes.CREATE_TRANSACTION,
        },
        transaction,
      });

      if (!associatedConcurrence || !associatedTask || !associatedJob) {
        return;
      }

      const associatedTaskId = String(associatedTask.id);
      const associatedJobId = String(associatedJob.id);

      // Stop currently running task to start modification
      stopCronTask(associatedTaskId);

      const concurrenceObj = parseConcurrenceObj(concurrence);

      // Update concurrence form data
      await associatedConcurrence.update(concurrenceObj, { transaction });

      await setupOrUpdateJob({
        user,
        startDate,
        startDateOnly: true,
        jobName: JobTypes.CREATE_TRANSACTION,
        particularJobArgs: jobArgs,
        existingTaskId: associatedTaskId,
        existingJobId: associatedJobId,
        cronExpression,
        timezone,
        nextExecutionDate,
        target,
      }, { transaction });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default upsertConcurrence;
