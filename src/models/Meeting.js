import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Meeting = sequelize.define(
  'meeting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY
    },
    startTime: {
      type: DataTypes.TIME
    },
    endTime: {
      type: DataTypes.TIME
    },
    status: {
      type: DataTypes.ENUM('PENDIENTE', 'EN PROCESO', 'COMPLETADA'),
      defaultValue: 'PENDIENTE',
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

export const getMeetingModel = () => {
  return Meeting;
};

// // model Agreement (idMeeting)
// Meeting.hasMany(Agreement, {
//   foreignKey: {
//     name: 'idMeeting',
//     allowNull: false
//   }
// });

// Agreement.belongsTo(Meeting, {
//   foreignKey: {
//     name: 'idMeeting',
//     allowNull: false
//   }
// });

// // idSecretary
// User.hasMany(Meeting, {
//   foreignKey: {
//     name: 'idSecretary'
//   }
// });

// Meeting.belongsTo(User, {
//   foreignKey: {
//     name: 'idSecretary'
//   }
// });

// // idTypeOfMeeting
// TypeOfMeeting.hasMany(Meeting, {
//   foreignKey: {
//     name: 'idTypeOfMeeting',
//     allowNull: false
//   }
// });

// Meeting.belongsTo(TypeOfMeeting, {
//   foreignKey: {
//     name: 'idTypeOfMeeting',
//     allowNull: false
//   }
// });

// // model MeetingGuest (idMeeting)
// Meeting.belongsToMany(User, {
//   through: MeetingGuest,
//   foreignKey: {
//     name: 'idMeeting'
//   }
// });

// // model MeetingGuest (idGuest)
// User.belongsToMany(Meeting, {
//   through: MeetingGuest,
//   foreignKey: {
//     name: 'idGuest'
//   }
// });

// // model MeetingAbsence (idMeeting)
// Meeting.belongsToMany(User, {
//   through: MeetingAbsence,
//   foreignKey: {
//     name: 'idMeeting'
//   }
// });

// // model MeetingAbsence (idAbsent)
// User.belongsToMany(Meeting, {
//   through: MeetingAbsence,
//   foreignKey: {
//     name: 'idAbsent'
//   }
// });
