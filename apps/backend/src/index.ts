import express from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { SequelizeStorage, Umzug } from 'umzug';
import loggerHttp from 'pino-http';
import logger from '@lib/utils/logger';
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

const sequelize = SequelizeConnection.getInstance();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Options
const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
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
app.use(loggerHttp({
  logger,
}));

app.use(responseInterceptor);

app.use('/api/user', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/page', pageRouter);
app.use('/api/category', categoryRouter);

function init() {
  sequelize
    .createSchema(process.env.DB_SCHEMA || 'public', { logging: console.log })
    .catch(() => {
      logger.error('Schema already exists');
    });

  sequelize
    .sync()
    .then(async () => {
      logger.sequelize('Database synchronized');
    })
    .catch((err) => logger.error(`Error synchronizing database: ${err}`));
}

init();

// UMZUG (migrations tool)
const runMigrations = async () => {
  logger.server('Initializing umzug');
  const umzug = new Umzug({
    migrations: { glob: 'src/database/migrations/*.cjs' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger,
  });

  await umzug.up();
};

runMigrations().catch((error) => {
  logger.error('Migration failed: ', error);
  process.exit(1);
});

startCronManager().catch((err) => {
  logger.error(`error starting cron manager: ${err}`);
});

app.listen(PORT, () => {
  logger.server(`listening to port ${PORT} at ${cliTheme.underline('http://localhost:3000/')}`);
});
