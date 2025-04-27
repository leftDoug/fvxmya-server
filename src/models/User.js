import { DataTypes } from 'sequelize';

import { sequelize } from '../db/config.js';

export const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ADMINISTRADOR', 'LÍDER', 'TRABAJADOR'),
      defaultValue: 'TRABAJADOR',
      allowNull: false
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export const getUserModel = () => {
  return User;
};

// // idArea
// Area.hasMany(User, {
//   foreignKey: {
//     name: 'idArea',
//     allowNull: false
//   }
// });

// User.belongsTo(Area, {
//   foreignKey: {
//     name: 'idArea',
//     allowNull: false
//   }
// });

// // idRole
// Role.hasMany(User, {
//   foreignKey: {
//     name: 'idRole',
//     allowNull: false
//   }
// });

// User.belongsTo(Role, {
//   foreignKey: {
//     name: 'idRole',
//     allowNull: false
//   }
// });

// // model Organization (idLeader)
// User.hasMany(Organization, {
//   foreignKey: {
//     name: 'idLeader',
//     allowNull: false
//   }
// });

// Organization.belongsTo(User, {
//   foreignKey: {
//     name: 'idLeader',
//     allowNull: false
//   }
// });

// // model OrganizationMember (idOrganization)
// Organization.belongsToMany(User, {
//   through: OrganizationMember,
//   foreignKey: {
//     name: 'idOrganization'
//   }
// });

// // model OrganizationMember (idMember)
// User.belongsToMany(Organization, {
//   through: OrganizationMember,
//   foreignKey: {
//     name: 'idMember'
//   }
// });
