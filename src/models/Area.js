import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';
import { nameRegExp } from '../helpers/utils.js';
// import { User } from './User.js';

export const Area = sequelize.define(
  'area',
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export const getAreaModel = () => {
  return Area;
};
