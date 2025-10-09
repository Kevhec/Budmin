import cron from 'node-cron';
import deleteUnverifiedUsers from '../jobs/deleteUnverifiedUsers';
import loadCronTasks from './taskLoader';
import logger from '../utils/logger';

async function startCronManager() {
  try {
    logger.server('Starting cron task manager');
    logger.server('Loading stored tasks...');
    await loadCronTasks();
    logger.server('Cron tasks loaded');

    logger.server('Initializing task for unverified users deletion');
    cron.schedule('0 0 * * *', async () => {
      await deleteUnverifiedUsers();
    });
    logger.server('Unverified users deletion task initialized');
    logger.server('Cron manager initialized correctly');
  } catch (error) {
    logger.error(`Cron tasks couldn't be loaded ${error}`);
  }
}

export default startCronManager;
