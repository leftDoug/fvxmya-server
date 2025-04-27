import { DataTypes, Sequelize } from 'sequelize';

import { sequelize } from '../db/config.js';

export const Agreement = sequelize.define('agreement', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
    defaultValue: Sequelize.literal(
      "to_char(current_timestamp, 'YYYYMMDDHH24MISSMS')"
    )
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  compilanceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
});

export const getAgreementModel = () => {
  return Agreement;
};

// // model Response (idAgreement)
// Agreement.hasMany(Response, {
//   foreignKey: {
//     name: 'idAgreement',
//     allowNull: false
//   }
// });

// Response.belongsTo(Agreement, {
//   foreignKey: {
//     name: 'idAgreement',
//     allowNull: false
//   }
// });

// // idResponsible
// User.hasMany(Agreement, {
//   foreignKey: {
//     name: 'idResponsible',
//     allowNull: false
//   }
// });

// Agreement.belongsTo(User, {
//   foreignKey: {
//     name: 'idResponsible',
//     allowNull: false
//   }
// });
