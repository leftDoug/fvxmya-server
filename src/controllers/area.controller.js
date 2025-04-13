import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { Area } from '../models/Area.js';
import { User } from '../models/User.js';

export const getAll = async (req, res = response) => {
  try {
    const dbAreas = await Area.findAll();
    return res.json({
      data: dbAreas
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al listar las Áreas'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbArea = await Area.findByPk(id);
    return res.json({
      data: dbArea
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al buscar el Área'
    });
  }
};

export const create = async (req = request, res = response, next) => {
  const { name } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbArea = await Area.findOne({ where: { name }, transaction });

    if (dbArea) {
      return res.status(400).json({
        message: 'Ya existe un Área con este nombre'
      });
    }

    const area = await Area.create({ name }, { transaction });
    await transaction.commit();
    return res.status(201).json({
      message: 'Área creada',
      data: area
    });
  } catch (err) {
    await transaction.rollback();
    if (err.name === 'SequelizeValidationError') {
      next(err);
    } else {
      console.error(err);
      return res.status(500).json({
        message: 'Error al crear el Área.'
      });
    }
  }
};

export const update = async (req = request, res = response, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbArea = await Area.findOne({ where: { name }, transaction });

    if (dbArea && dbArea.id !== parseInt(id, 10)) {
      return res.status(400).json({
        message: 'Ya existe un Área con ese nombre'
      });
    }

    await Area.update(
      { name },
      { where: { id: parseInt(id, 10) }, transaction }
    );
    const area = await Area.findByPk(parseInt(id, 10), { transaction });
    await transaction.commit();
    return res.json({
      message: 'Área actualizada',
      data: area
    });
  } catch (err) {
    await transaction.rollback();
    if (err.name === 'SequelizeValidationError') {
      next(err);
    } else {
      console.error(err);
      return res.status(500).json({
        message: 'Error al actualizar el Área'
      });
    }
  }
};

export const remove = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await Area.destroy({ where: { id: parseInt(id, 10) }, transaction });
    await transaction.commit();
    return res.json({
      message: 'Área eliminada'
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({
      message: 'Error al eliminar el Área.'
    });
  }
};

export const getWorkers = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbArea = await Area.findByPk(id, { include: User });
    const workers = dbArea.users.map((w) => ({
      id: w.id,
      name: w.name,
      occupation: w.occupation,
      email: w.email
    }));

    return res.json({
      data: workers
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener los Trabajadores'
    });
  }
};
