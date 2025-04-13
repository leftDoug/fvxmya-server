import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';
import { TypeOfMeeting } from './TypeOfMeeting.js';

export const Organization = sequelize.define(
  'organization',
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);

export const getOrganizationModel = () => {
  return Organization;
};

// Organization.hasMany(TypeOfMeeting, {
//   foreignKey: {
//     name: 'idOrganization',
//     allowNull: false
//   }
// });

// TypeOfMeeting.belongsTo(Organization, {
//   foreignKey: {
//     name: 'idOrganization',
//     allowNull: false
//   }
// });
