/* eslint-disable @typescript-eslint/no-var-requires */
import readline from 'readline';
import { exec } from 'child_process';
import logger from '../utils/logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter migration name: ', (migrationName) => {
  if (!migrationName) {
    logger.error('Migration name is required, please re-execute.');
    rl.close();
    process.exit(1);
  }

  const command = `dotenvx run -f .env.development -- pnpm dlx sequelize-cli migration:generate --name ${migrationName}`;
  logger.info('Creating migration by running');
  logger.info(command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error: ${error.message}`);
      rl.close();
      process.exit(1);
    }

    if (stderr) {
      logger.error(`stderr: ${stderr}`);
    }

    logger.info('REMEMBER to change file format to cjs to work with Umzug.');

    logger.info(stdout);
    rl.close();
  });
});
