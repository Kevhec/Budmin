import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import {
  TargetType,
  ConcurrenceType, DefaultConcurrences, type Models, MonthSelect, WeekDays, WithEndDate,
} from '@/src/lib/types';
import { format } from '@formkit/tempo';
import { CONCURRENCE_TYPE } from '@/src/lib/constants';
import SequelizeConnection from '../config/SequelizeConnection';
import type User from './user';

const sequelize = SequelizeConnection.getInstance();

class Concurrence extends Model<
InferAttributes<Concurrence>,
InferCreationAttributes<Concurrence>
> {
  declare id: CreationOptional<string>;

  declare defaults: CreationOptional<DefaultConcurrences>;

  declare type: CreationOptional<typeof CONCURRENCE_TYPE[number]>;

  declare steps: CreationOptional<number>;

  declare endDate: CreationOptional<Date>;

  declare withEndDate: CreationOptional<boolean>;

  declare weekDay: CreationOptional<WeekDays>;

  declare time: CreationOptional<Date>;

  declare monthSelect: CreationOptional<MonthSelect>;

  declare userId: ForeignKey<User['id']>;

  declare targetId: ForeignKey<string>;

  declare targetType: TargetType;

  public static associate(models: Models) {
    this.belongsTo(models.Budget, {
      foreignKey: 'targetId',
      foreignKeyConstraint: false,
      constraints: false,
      as: 'budgetConcurrence',
    });
    this.belongsTo(models.Transaction, {
      foreignKey: 'targetId',
      foreignKeyConstraint: false,
      constraints: false,
      as: 'transactionConcurrence',
    });
  }
}

Concurrence.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  defaults: {
    type: DataTypes.ENUM(...Object.values(DefaultConcurrences)),
    defaultValue: DefaultConcurrences.NONE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(ConcurrenceType)),
    defaultValue: ConcurrenceType.DAILY,
    allowNull: false,
  },
  steps: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    defaultValue: null,
    allowNull: true,
  },
  withEndDate: {
    type: DataTypes.BOOLEAN,
    defaultValue: WithEndDate.FALSE,
    allowNull: false,
  },
  weekDay: {
    type: DataTypes.ENUM(...Object.values(WeekDays)),
    defaultValue: format(new Date(), 'dddd', 'en').toLowerCase(),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
    allowNull: false,
  },
  monthSelect: {
    type: DataTypes.ENUM(...Object.values(MonthSelect)),
    defaultValue: MonthSelect.EXACT,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  targetType: {
    type: DataTypes.ENUM(...Object.values(TargetType)),
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  tableName: 'concurrences',
  modelName: 'Concurrence',
});

export default Concurrence;
