import CronTask from '@/src/database/models/cronTask';
import { Transaction } from 'sequelize';
import { TargetType, Target, UserAttributes } from '../types';

interface Params {
  user: UserAttributes,
  data: {
    cronExpression?: string
    endDate?: Date
    timezone?: string
  }
  target: Target<TargetType>
  taskId?: string
}

async function upsertCronTask(
  {
    user,
    data,
    taskId,
    target,
  }: Params,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    if (taskId) {
      await CronTask.update({
        ...data,
      }, {
        where: {
          id: taskId,
          userId: user.id,
        },
        transaction,
      });

      return taskId;
    }

    const newTask = await CronTask.create({
      ...data,
      userId: user.id,
      targetId: target.id,
      targetType: target.type,
    }, { transaction });

    return newTask.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error while upserting cron task: ${error.message}`);
  }
}

export default upsertCronTask;
