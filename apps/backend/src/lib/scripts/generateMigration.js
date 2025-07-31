/* eslint-disable @typescript-eslint/no-var-requires */
import readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter migration name: ', (migrationName) => {
  if (!migrationName) {
    console.error('Migration name is required, please re-execute.');
    rl.close();
    process.exit(1);
  }

  const command = `dotenvx run -f .env.development -- pnpm dlx sequelize-cli migration:generate --name ${migrationName}`;
  console.log('Creating migration by running');
  console.log(command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      rl.close();
      process.exit(1);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    console.log('REMEMBER to change file format to cjs to work with Umzug.');

    console.log(stdout);
    rl.close();
  });
});
