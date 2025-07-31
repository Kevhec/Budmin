import {
  Model,
  DataTypes,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import type { Models } from '@/src/lib/types';
import SequelizeConnection from '../config/SequelizeConnection';
import User from './user';
import Budget from './budget';
import Category from './category';
import Concurrence from './concurrence';
import CronTask from './cronTask';

const sequelize = SequelizeConnection.getInstance();

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

class Transaction
  extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
  declare id: CreationOptional<string>;

  declare description: string;

  declare amount: number;

  declare date: Date;

  declare type: TransactionType;

  declare transactionConcurrence?: Concurrence;

  declare transactionCronTask?: CronTask;

  declare userId: ForeignKey<User['id']>;

  declare categoryId: ForeignKey<Category['id']> | null;

  declare budgetId: ForeignKey<Budget['id']>;

  public static associate(models: Models) {
    this.belongsTo(models.Budget, {
      foreignKey: 'budgetId',
      as: 'budget',
    });
    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    this.hasOne(models.CronTask, {
      foreignKey: 'targetId',
      constraints: false,
      foreignKeyConstraint: false,
      scope: { targetType: 'Transaction' },
      onDelete: 'CASCADE',
      as: 'transactionCronTask',
    });
    this.hasOne(models.Concurrence, {
      foreignKey: 'targetId',
      constraints: false,
      foreignKeyConstraint: false,
      scope: { targetType: 'Transaction' },
      onDelete: 'CASCADE',
      as: 'transactionConcurrence',
    });
  }
}

Transaction.init({
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(TransactionType)),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now(),
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'transactions',
  modelName: 'Transaction',
});

export default Transaction;
