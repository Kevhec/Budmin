import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import type { Models } from '@/src/lib/types';
import SequelizeConnection from '../config/SequelizeConnection';
import type User from './user';
import Concurrence from './concurrence';
import CronTask from './cronTask';

const sequelize = SequelizeConnection.getInstance();

class Budget extends Model<InferAttributes<Budget>, InferCreationAttributes<Budget>> {
  declare id: CreationOptional<string>;

  declare name: string;

  declare totalAmount: CreationOptional<number>;

  declare startDate: CreationOptional<Date>;

  declare endDate: CreationOptional<Date>;

  declare budgetConcurrence?: Concurrence;

  declare budgetCronTask?: CronTask;

  declare userId: ForeignKey<User['id']>;

  public static associate(models: Models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.hasMany(models.Transaction, { foreignKey: 'budgetId' });
    this.hasOne(models.CronTask, {
      foreignKey: 'targetId',
      constraints: false,
      foreignKeyConstraint: false,
      scope: { targetType: 'Budget' },
      onDelete: 'CASCADE',
      as: 'budgetCronTask',
    });
    this.hasOne(models.Concurrence, {
      foreignKey: 'targetId',
      constraints: false,
      foreignKeyConstraint: false,
      scope: { targetType: 'Budget' },
      onDelete: 'CASCADE',
      as: 'budgetConcurrence',
    });
  }
}

Budget.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Budget',
  },
  totalAmount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'budgets',
  modelName: 'Budget',
});

export default Budget;
