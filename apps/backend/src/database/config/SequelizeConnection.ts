import { cliTheme } from '@lib/utils';
import { type Dialect, Sequelize } from 'sequelize';

class SequelizeConnection {
  private static instance: Sequelize;

  private constructor() {
    const dbName = process.env.DB_NAME || '';
    const dbUser = process.env.DB_USERNAME || '';
    const dbHost = process.env.DB_HOST;
    const dbDriver = process.env.DB_DRIVER as Dialect;
    const dbPassword = process.env.DB_PASSWORD || '';

    SequelizeConnection.instance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: dbDriver,
      port: 5433,
      logging: (...msg) => console.log(`${cliTheme.db('[SEQUELIZE]')}: ${msg}`),
    });

    SequelizeConnection.instance.authenticate().then(() => {
      console.log('Sequelize connected');
    });
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
