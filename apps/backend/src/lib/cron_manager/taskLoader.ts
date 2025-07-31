import CronTask from '@/src/database/models/cronTask';
import CronJob from '@/src/database/models/cronJobs';
import { type Job, scheduleCronTask } from './taskScheduler';

async function loadCronTasks() {
  try {
    const tasks = await CronTask.findAll({
      where: {
        isFinished: false,
      },
      include: [
        {
          model: CronJob,
          as: 'cronJobs',
        },
      ],
    });

    tasks.forEach(async (task) => {
      const {
        cronExpression,
        timezone,
        endDate,
        cronJobs,
      } = task;

      if (!cronJobs) {
        throw new Error('No jobs associated to provided task');
      }

      await scheduleCronTask({
        cronExpression,
        timezone,
        endDate: endDate ? new Date(endDate) : undefined,
        taskId: task.id,
        jobs: cronJobs as unknown as Job[],
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error loading cron tasks');
  }
}

export default loadCronTasks;
