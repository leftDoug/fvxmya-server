import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Token = sequelize.define(
  'token',
  {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

export const getTokenModel = () => {
  return Token;
};
