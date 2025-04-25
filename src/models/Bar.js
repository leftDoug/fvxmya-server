import { DataTypes } from 'sequelize';
import { sequelize } from '../db/config.js';
import { Foo } from './Foo.js';

export const Bar = sequelize.define(
  'bar',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export function getBarModel() {
  return Bar;
}

// Bar.hasMany(Foo, { foreignKey: 'idBar' });
// Foo.belongsTo(Bar, { foreignKey: 'idBar' });
