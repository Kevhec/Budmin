import { type Dialect, Options, Sequelize } from 'sequelize';
import fs from 'fs';
import logger from '@/src/lib/utils/logger';

class SequelizeConnection {
  private static instance: Sequelize;

  private constructor() {
    const dbName = process.env.DB_NAME || '';
    const dbUser = process.env.DB_USERNAME || '';
    const dbHost = process.env.DB_HOST;
    const dbDriver = process.env.DB_DRIVER as Dialect || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbPort = Number(process.env.DB_PORT) || 5433;
    const schema = process.env.DB_SCHEMA || 'public';
    const withSsl = process.env.DB_SSL || false;

    const connectionOptions: Options = {
      host: dbHost,
      dialect: dbDriver,
      port: dbPort,
      define: {
        schema,
      },
      logging: (...msg) => logger.sequelize(`${msg}`),
    };

    if (withSsl && dbDriver === 'postgres') {
      connectionOptions.ssl = true;
      connectionOptions.dialectOptions = {
        ssl: {
          ca: process.env.DB_CA_CERT || fs.readFileSync('ca.pem').toString(),
          rejectUnauthorized: true,
        },
      };
    }

    SequelizeConnection.instance = new Sequelize(
      dbName,
      dbUser,
      dbPassword,
      connectionOptions,
    );

    SequelizeConnection.instance
      .authenticate()
      .then(() => {
        logger.sequelize('Sequelize connected');
      })
      .catch((err) => logger.error(`ERROR CONNECTING DB: ${err}`));
  }

  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      // eslint-disable-next-line no-new
      new SequelizeConnection();
    }

    return SequelizeConnection.instance;
  }
}

export default SequelizeConnection;
