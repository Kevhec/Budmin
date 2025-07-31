import { Models } from '@/src/lib/types';
import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';

enum SupportedCurrencies {
  COP = 'COP',
  USD = 'USD',
}

enum Locales {
  ES = 'es',
  EN = 'en',
}

enum TimeFormats {
  TWELVE_BASED = '12',
  TWENTY_FOUR_BASED = '24',
}

enum Themes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

const sequelize = SequelizeConnection.getInstance();

class UserPreferences
  extends Model<InferAttributes<UserPreferences>, InferCreationAttributes<UserPreferences>> {
  declare id: CreationOptional<string>;

  declare language: Locales;

  declare currency: SupportedCurrencies;

  declare dateFormat: string;

  declare timeFormat: TimeFormats;

  declare theme: Themes;

  declare timezone: string;

  public static associate(models: Models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

UserPreferences.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM(...Object.values(Locales)),
    defaultValue: Locales.ES,
    allowNull: false,
  },
  currency: {
    type: DataTypes.ENUM(...Object.values(SupportedCurrencies)),
    defaultValue: SupportedCurrencies.COP,
    allowNull: false,
  },
  dateFormat: {
    type: DataTypes.STRING,
    defaultValue: 'DD-MM-YYYY',
    allowNull: false,
  },
  timeFormat: {
    type: DataTypes.ENUM(...Object.values(TimeFormats)),
    defaultValue: TimeFormats.TWELVE_BASED,
    allowNull: false,
  },
  theme: {
    type: DataTypes.ENUM(...Object.values(Themes)),
    defaultValue: Themes.SYSTEM,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'user-preferences',
  modelName: 'UserPreferences',
});

export default UserPreferences;
