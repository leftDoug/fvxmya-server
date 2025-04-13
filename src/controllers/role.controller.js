import { request, response } from 'express';

import { Role } from '../models/Role.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbRoles = await Role.findAll();

    return res.json({
      ok: true,
      arg: dbRoles
    });
  } catch (error) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al listar los Roles'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbRole = await Role.findByPk(id);

    return res.json({
      ok: true,
      arg: dbRole
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al buscar Rol.'
    });
  }
};
