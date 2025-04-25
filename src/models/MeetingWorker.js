import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const MeetingWorker = sequelize.define(
  'meetingsWorkers',
  {
    idMeeting: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'meetings',
        key: 'id'
      }
    },
    idWorker: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    member: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDIENTE', 'PRESENTE', 'AUSENTE'),
      defaultValue: 'PENDIENTE',
      allowNull: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

export const getMeetingWorkerModel = () => {
  return MeetingWorker;
};
