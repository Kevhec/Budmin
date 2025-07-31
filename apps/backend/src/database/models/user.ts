import {
  Model,
  DataTypes,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import type { Models } from '@/src/lib/types';
import SequelizeConnection from '../config/SequelizeConnection';
import UserPreferences from './userPreferences';

const sequelize = SequelizeConnection.getInstance();

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;

  declare username: string;

  declare email: string;

  declare password: string;

  declare birthday: Date;

  declare role: CreationOptional<string>;

  declare confirmed: CreationOptional<boolean>;

  declare preferences?: InferAttributes<UserPreferences>;

  declare token: CreationOptional<string | null>;

  declare createdAt?: CreationOptional<Date>;

  declare updatedAt?: CreationOptional<Date>;

  public static associate(models: Models) {
    this.hasMany(models.Page, { foreignKey: 'userId' });
    this.hasMany(models.Budget, { foreignKey: 'userId' });
    this.hasMany(models.Transaction, { foreignKey: 'userId' });
    this.hasMany(models.Category, { foreignKey: 'userId' });
    this.hasMany(models.CronTask, { foreignKey: 'userId' });
    this.hasMany(models.CronJob, { foreignKey: 'userId' });
    this.hasMany(models.Concurrence, { foreignKey: 'userId' });
    this.hasOne(models.UserPreferences, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'preferences' });
  }
}

User.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Invitado',
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
    defaultValue: null,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  token: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: DataTypes.UUIDV4,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    set(value: boolean) {
      if (this.getDataValue('role') === 'guest') {
        this.setDataValue('confirmed', true);
      } else {
        this.setDataValue('confirmed', value);
      }
    },
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
  hooks: {
    afterCreate: async (user) => {
      if (user.role === 'guest') {
        await user.update({ confirmed: true });
      }
    },
  },
});

export default User;
