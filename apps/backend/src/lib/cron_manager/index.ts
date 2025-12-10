import cron from 'node-cron';
import deleteUnverifiedUsers from '../jobs/deleteUnverifiedUsers';
import loadCronTasks from './taskLoader';
import { cliTheme } from '../utils';

async function startCronManager() {
  try {
    console.log(`${cliTheme.server('[Server]')} Starting cron task manager`);
    console.log(`${cliTheme.server('[Server]')} Loading stored tasks...`);
    await loadCronTasks();
    console.log(`${cliTheme.server('[Server]')} Cron tasks loaded`);

    console.log(`${cliTheme.server('[Server]')} Initializing task for deletion of unverified users`);
    cron.schedule('0 0 * * *', async () => {
      deleteUnverifiedUsers();
    });
    console.log(`${cliTheme.server('[Server]')} Unverified users deletion task initialized`);
    console.log(`${cliTheme.server('[Server]')} Cron manager initialized correctly`);
  } catch (error) {
    console.log(`${cliTheme.serverWarn('[Server]')} Cron tasks couldn't be loaded`, error);
  }
}

export default startCronManager;
