import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Agenda = sequelize.define(
  'agenda',
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export const getAgendaModel = () => {
  return Agenda;
};

// // model Topic (idAgenda)
// Agenda.hasMany(Topic, {
//   foreignKey: {
//     name: 'idAgenda',
//     allowNull: false
//   }
// });

// Topic.belongsTo(Agenda, {
//   foreignKey: {
//     name: 'idAgenda',
//     allowNull: false
//   }
// });
