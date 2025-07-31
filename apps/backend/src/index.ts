import express from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { SequelizeStorage, Umzug } from 'umzug';
import responseInterceptor from './middleware/interceptors.js';
import {
  budgetRoutes, transactionRoutes, pageRouter, userRoutes,
  categoryRouter,
} from './router/index.js';
import SequelizeConnection from './database/config/SequelizeConnection.js';
import startCronManager from './lib/cron_manager/index.js';
import cliTheme from './lib/utils/chalk.js';

const sequelize = SequelizeConnection.getInstance();

const app = express();
const PORT = 3000;

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

app.use(responseInterceptor);

app.use('/api/user', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/page', pageRouter);
app.use('/api/category', categoryRouter);

sequelize.sync().then(async () => {
  console.log(`${cliTheme.db('[SEQUELIZE]')}: Database synchronized`);
});

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

startCronManager();

app.listen(PORT, () => {
  console.log(
    `\n${cliTheme.server('[Server]')}: listening to port ${PORT}
          at ${cliTheme.underline('http://localhost:3000/')}\n`,
  );
});
