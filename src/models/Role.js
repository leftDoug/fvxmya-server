import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Role = sequelize.define(
  'role',
  {
    role: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export const getRoleModel = () => {
  return Role;
};
