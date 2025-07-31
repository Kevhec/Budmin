import cron, { type ScheduledTask } from 'node-cron';
import CronTask from '@/src/database/models/cronTask';
import { Transaction } from 'sequelize';
import {
  JobTypes,
  type CreateBudgetParams,
  type CreateTransactionParams,
  type JobParams,
} from '../types';
import {
  createBudget as createBudgetJob,
  createTransaction as createTransactionJob,
} from '../jobs';

export interface Job {
  jobName: JobTypes
  jobArgs: JobParams<typeof jobsMapping>
}

interface Params {
  cronExpression: string
  endDate?: Date
  timezone: string
  taskId: string
  jobs: Job[]
}

const activeTasks = new Map<string, ScheduledTask>();

const jobsMapping = {
  'create-budget': createBudgetJob,
  'create-transaction': createTransactionJob,
} as const;

async function scheduleCronTask(
  {
    cronExpression,
    timezone,
    endDate,
    taskId,
    jobs,
  }: Params,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    const task = await CronTask.findByPk(taskId, { transaction });
    if (!task) throw new Error(`Task with ID ${taskId} not found.`);

    console.log({ endDate });
    const cronTask = cron.schedule(
      cronExpression,
      async () => {
        const now = new Date();

        if (endDate && endDate < now) {
          cronTask.stop();
          await task.update({
            isFinished: true,
          });
        }

        try {
          await Promise.all(
            jobs.map(async (job) => {
              const { jobArgs, jobName } = job;

              switch (jobName) {
                case JobTypes.CREATE_BUDGET:
                  await createBudgetJob({
                    ...jobArgs,
                    startDate: now,
                  } as CreateBudgetParams);
                  break;
                case JobTypes.CREATE_TRANSACTION:
                  await createTransactionJob({
                    ...jobArgs,
                    startDate: now,
                  } as CreateTransactionParams);
                  break;
                default:
                  console.error(`No job function found for name: ${jobName}`);
              }
            }),
          );
        } catch (error) {
          console.error(`Error executing jobs for task ${taskId}:`, error);
        }
      },
      {
        timezone,
      },
    );

    activeTasks.set(taskId, cronTask);
  } catch (error) {
    console.error(`Error scheduling task ${taskId}:`, error);
  }
}

async function stopCronTask(
  taskId: string,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    const task = await CronTask.findByPk(taskId, { transaction });
    if (!task) throw new Error(`Task with ID ${taskId} not found.`);

    task.update({
      isFinished: true,
    });

    const activeTask = activeTasks.get(taskId);
    if (activeTask) {
      activeTask.stop();
      activeTasks.delete(taskId);
    }
  } catch (error) {
    console.log(`No active task found with ID: ${taskId}`);
  }
}

export {
  scheduleCronTask,
  stopCronTask,
};
