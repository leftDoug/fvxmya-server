import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const MeetingTopic = sequelize.define(
  'meetingsTopics',
  {
    idMeeting: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'meetings',
        key: 'id'
      }
    },
    idTopic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topics',
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    paranoid: true
  }
);

export const getMeetingTopicModel = () => {
  return MeetingTopic;
};
