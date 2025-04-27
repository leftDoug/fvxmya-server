import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Response = sequelize.define('response', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export const getResponseModel = () => {
  return Response;
};
