/* eslint-disable no-param-reassign */
import { Model, DataTypes, type ForeignKey } from 'sequelize';
import SequelizeConnection from '../config/SequelizeConnection';
import User from './user';

const sequelize = SequelizeConnection.getInstance();

export default class Page extends Model {
  declare id: string;

  declare name: string;

  declare userId: ForeignKey<User['id']>;
}

Page.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Page',
  },
}, {
  sequelize,
  timestamps: true,
  paranoid: true,
  tableName: 'pages',
  modelName: 'Page',
});
