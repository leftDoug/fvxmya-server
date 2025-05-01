import bcrypt from 'bcryptjs';
import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { User } from '../models/User.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbUsers = await User.findAll({
      attributes: [
        'id',
        'username',
        'name',
        'occupation',
        'area',
        'role',
        'state'
      ]
    });

    return res.json({
      ok: true,
      data: dbUsers
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener los Usuarios'
    });
  }
};

export const getAllWorkers = async (req = request, res = response) => {
  try {
    const dbUsers = await User.findAll({
      attributes: ['id', 'name', 'occupation']
    });

    return res.json({
      ok: true,
      data: dbUsers
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener los trabajadores'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbUser = await User.findByPk(id, {
      attributes: ['id', 'username', 'name', 'occupation', 'area', 'role']
    });

    return res.json({
      ok: true,
      data: dbUser
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener el Usuario'
    });
  }
};

export const create = async (req = request, res = response, next) => {
  const { name, occupation, area, username, password, role } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let dbUser = await User.findOne({ where: { username }, transaction });

    if (dbUser) {
      return res.status(400).json({
        ok: false,
        message: 'Este nombre de usuario ya está en uso'
      });
    }

    const dbUsers = await User.findAll({ where: { name }, transaction });
    const userExists = dbUsers.some(
      (user) => user.occupation === occupation && user.area === area
    );

    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'Este trabajador ya tiene un Usuario creado'
      });
    }

    const coincidence = dbUsers.some((user) => user.area === area);

    if (coincidence) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un trabajador con este nombre en esta Área'
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create(
      {
        name,
        username,
        password: hashedPassword,
        occupation,
        area,
        role
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado',
      data: user
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      next(err);
    }

    console.error(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al crear el Usuario'
    });
  }
};

export const update = async (req = request, res = response, next) => {
  const { id } = req.params;
  const { name, occupation, area, role } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let dbUser = await User.findByPk(id, { transaction });
    const dbUsers = await User.findAll({ where: { name }, transaction });

    const userExists = dbUsers.some(
      (usr) =>
        usr.id !== dbUser.id &&
        usr.occupation === occupation &&
        usr.area === area
    );

    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'Este trabajador ya tiene un Usuario creado'
      });
    }

    const coincidence = dbUsers.some(
      (usr) => usr.id !== dbUser.id && usr.area === area
    );

    if (coincidence) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un trabajador con este nombre en esta Área'
      });
    }

    // TODO hacer los update asi
    if (name) dbUser.name = name;
    if (occupation) dbUser.occupation = occupation;
    if (area) dbUser.area = area;
    if (role) dbUser.role = role;

    await dbUser.save({ transaction });

    const user = {
      id: dbUser.id,
      username: dbUser.username,
      name: dbUser.name,
      occupation: dbUser.occupation,
      area: dbUser.area,
      role: dbUser.role
    };

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Usuario actualizado',
      data: user
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      next(err);
    }

    console.error(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar el Usuario'
    });
  }
};

export const lock = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const dbUser = await User.findByPk(id, { transaction });
    dbUser.state = false;

    await dbUser.save({ transaction });
    await transaction.commit();

    const user = {
      id: dbUser.id,
      username: dbUser.username,
      name: dbUser.name,
      occupation: dbUser.occupation,
      area: dbUser.area,
      role: dbUser.role,
      state: dbUser.state
    };

    return res.json({
      ok: true,
      message: 'Usuario bloqueado',
      data: user
    });
  } catch (err) {
    console.log(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al bloquear el Usuario'
    });
  }
};

export const unlock = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const dbUser = await User.findByPk(id, { transaction });
    dbUser.state = true;

    await dbUser.save({ transaction });
    await transaction.commit();

    const user = {
      id: dbUser.id,
      username: dbUser.username,
      name: dbUser.name,
      occupation: dbUser.occupation,
      area: dbUser.area,
      role: dbUser.role,
      state: dbUser.state
    };

    return res.json({
      ok: true,
      message: 'Usuario activado',
      data: user
    });
  } catch (err) {
    console.log(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al activar el Usuario'
    });
  }
};
