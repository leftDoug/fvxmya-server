import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Meeting = sequelize.define(
  'meeting',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
      // validate: {
      //   notNull: {
      //     msg: 'El nombre de la reunión es obligatorio'
      //   },
      //   len: {
      //     args: [5, 70],
      //     msg: 'El nombre de la reunión debe tener entre 5 y 70 caracteres'
      //   },
      //   isAlphanumeric: {
      //     msg: 'El nombre de la reunión solo puede contener letras y números'
      //   }
      // }
    },
    session: {
      type: DataTypes.ENUM('ORDINARIA', 'EXTRAORDINARIA'),
      allowNull: false
      // validate: {
      //   notNull: {
      //     msg: 'La sesión de la reunión es obligatoria'
      //   },
      //   isIn: {
      //     args: [['ORDINARIA', 'EXTRAORDINARIA']],
      //     msg: 'La sesión de la reunión debe ser ORDINARIA o EXTRAORDINARIA'
      //   }
      // }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La fecha de la reunión es obligatoria'
        },
        isDate: {
          msg: 'La fecha de la reunión debe ser una fecha válida'
        },
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: 'La fecha de la reunión debe ser posterior a la fecha actual'
        }
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME
    },
    status: {
      type: DataTypes.ENUM('PENDIENTE', 'EN PROCESO', 'COMPLETADA'),
      defaultValue: 'PENDIENTE',
      allowNull: false
    },
    agreementsAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    paranoid: false
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
