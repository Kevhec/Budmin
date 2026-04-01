import express from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { SequelizeStorage, Umzug } from 'umzug';
import responseInterceptor from './middleware/interceptors.js';
import {
  budgetRoutes,
  transactionRoutes,
  pageRouter,
  userRoutes,
  categoryRouter,
} from './router/index.js';
import SequelizeConnection from './database/config/SequelizeConnection.js';
import startCronManager from './lib/cron_manager/index.js';
import cliTheme from './lib/utils/chalk.js';
import { appPort, dbSchema, frontendUrl } from './config/env.js';

const sequelize = SequelizeConnection.getInstance();

const app = express();

// CORS Options
const allowedDomains = [frontendUrl];
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(responseInterceptor);

// Setup routes
app.use('/api/user', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/page', pageRouter);
app.use('/api/category', categoryRouter);

function init() {
  sequelize
    .createSchema(dbSchema || 'public', { logging: console.log })
    .catch(() => {
      console.log('Schema already exists');
    });

  sequelize
    .sync()
    .then(async () => {
      console.log(`${cliTheme.db('[SEQUELIZE]')}: Database synchronized`);
    })
    .catch((err) => console.log(`Error synchronizing database: ${err}`));
}

init();

// UMZUG (migrations tool)
const runMigrations = async () => {
  console.log(`${cliTheme.server('[SERVER]')}: Initializing umzug`);
  const umzug = new Umzug({
    migrations: { glob: 'src/database/migrations/*.cjs' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await umzug.up();
};

runMigrations().catch((error) => {
  console.log(`${cliTheme.serverWarn('[ERROR]')}: Migration failed: `, error);
  process.exit(1);
});

startCronManager().catch((err) => {
  console.log(`error starting cron manager: ${err}`);
});

app.listen(appPort, () => {
  console.log(
    `\n${cliTheme.server('[Server]')}: listening to port ${appPort}
          at ${cliTheme.underline('http://localhost:3000/')}\n`,
  );
});
