import { CronTask } from '@/src/database/models';
import { Transaction } from 'sequelize';

async function deleteCronTask(
  taskId: string,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    await CronTask.destroy({
      where: {
        id: taskId,
      },
      transaction,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error while deleting the task with id ${taskId}. Details: ${error.message}`);
    }
  }
}

export default deleteCronTask;
