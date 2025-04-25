import { DataTypes } from 'sequelize';
import { sequelize } from '../db/config.js';

export const Foo = sequelize.define(
  'foo',
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
);

export function getFooModel() {
  return Foo;
}
