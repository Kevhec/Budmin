import CronJob from '@/src/database/models/cronJobs';
import { Transaction } from 'sequelize';
import { JobTypes, JSONValue, UserAttributes } from '../types';

interface Params {
  user: UserAttributes
  data: {
    jobName: JobTypes
    jobArgs: JSONValue
  }
  taskId: string
  jobId?: string
}

async function upsertCronJob(
  {
    user,
    data,
    taskId,
    jobId,
  }: Params,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    if (jobId) {
      await CronJob.update({
        ...data,
        cronTaskId: taskId,
      }, {
        where: {
          id: taskId,
          userId: user.id,
        },
        transaction,
      });

      const updatedJob = await CronJob.findByPk(jobId, { transaction });

      return updatedJob;
    }

    const newJob = await CronJob.create({
      ...data,
      cronTaskId: taskId,
      userId: user.id,
    }, { transaction });

    return newJob;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error while upserting cron task: ${error.message}`);
  }
}

export default upsertCronJob;
