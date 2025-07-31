import { User } from '@/src/database/models';
import { Op } from 'sequelize';
import deepUserRemove from './deepUserRemove';

async function deleteUnverifiedUsers() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  try {
    const unverifiedAndExpiredUsers = await User.findAll({
      where: {
        confirmed: false,
        createdAt: {
          [Op.lt]: sevenDaysAgo,
        },
      },
    });

    unverifiedAndExpiredUsers.forEach((user) => {
      deepUserRemove(user);
    });
  } catch (error) {
    throw new Error('Error while deleting unverified users');
  }
}

export default deleteUnverifiedUsers;
