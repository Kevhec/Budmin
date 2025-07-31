import SequelizeConnection from '@/src/database/config/SequelizeConnection';
import {
  Budget, Category, Transaction, User,
} from '@/src/database/models';
import Concurrence from '@/src/database/models/concurrence';
import CronJob from '@/src/database/models/cronJobs';
import CronTask from '@/src/database/models/cronTask';

const sequelize = SequelizeConnection.getInstance();

async function deepUserRemove(user: User) {
  try {
    const t = await sequelize.transaction();

    await Budget.destroy({
      where: {
        userId: user.id,
      },
      transaction: t,
    });

    await Category.destroy({
      where: {
        userId: user.id,
      },
      transaction: t,
    });

    await Transaction.destroy({
      where: {
        userId: user.id,
      },
      transaction: t,
    });

    await CronTask.destroy({
      where: {
        userId: user.id,
      },
      transaction: t,
    });

    await CronJob.destroy({
      where: {
        userId: user.id,
      },
      transaction: t,
    });

    await Concurrence.destroy({
      where: {
        userId: user.id,
      },
      transaction: t,
    });

    await user.destroy({
      transaction: t,
    });

    await t.commit();
  } catch (error) {
    throw new Error(`Error deleting user: ${user.id}`);
  }
}

export default deepUserRemove;
