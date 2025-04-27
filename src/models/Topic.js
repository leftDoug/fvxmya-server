import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Topic = sequelize.define(
  'topic',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export const getTopicModel = () => {
  return Topic;
};
