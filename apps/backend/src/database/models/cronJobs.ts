import {
  Model,
  DataTypes,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { JobTypes, JSONValue, type Models } from '@/src/lib/types';
import SequelizeConnection from '../config/SequelizeConnection';
import CronTask from './cronTask';
import User from './user';

const sequelize = SequelizeConnection.getInstance();

class CronJob extends Model<InferAttributes<CronJob>, InferCreationAttributes<CronJob>> {
  declare id: CreationOptional<string>;

  declare jobName: JobTypes;

  declare jobArgs: JSONValue;

  declare cronTaskId: ForeignKey<CronTask['id']>;

  declare userId: ForeignKey<User['id']>;

  public static associate(models: Models) {
    this.belongsTo(models.CronTask, {
      foreignKey: 'cronTaskId',
      as: 'cronTask',
    });
  }
}

CronJob.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  jobName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Budget',
  },
  jobArgs: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'cron-jobs',
  modelName: 'CronJob',
});

export default CronJob;
