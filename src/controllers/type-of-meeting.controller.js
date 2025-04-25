import { request, response } from 'express';
import { QueryTypes } from 'sequelize';

import { Meeting } from '../models/Meeting.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';
import { sequelize } from '../db/config.js';
import { Organization } from '../models/Organization.js';
import { getDateFromDb } from '../helpers/utils.js';
import { Agenda } from '../models/Agenda.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbToms = await TypeOfMeeting.findAll({ where: { state: true } });
    const toms = dbToms.map((tom) => ({
      id: tom.id,
      name: tom.name,
      idOrganization: tom.idOrganization
    }));
    return res.json({
      data: toms
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al listar los Tipos De Reuniones'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbTom = await TypeOfMeeting.findByPk(parseInt(id, 10));

    if (!dbTom) {
      return res.status(404).json({
        message: 'Tipo de Reunión no encontrado'
      });
    }
    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      idOrganization: dbTom.idOrganization
    };
    return res.json({
      data: tom
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: 'Error al buscar el Tipo de Reunión'
    });
  }
};

export const getInfo = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbTom = await TypeOfMeeting.findByPk(parseInt(id), {
      include: Organization
    });

    if (!dbTom) {
      return res.status(404).json({
        message: 'Tipo de Reunión no encontrado'
      });
    }

    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      organization: {
        id: dbTom.organization.id,
        name: dbTom.organization.name
      }
    };
    return res.json({
      data: dbTom
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al buscar el Tipo de Reunión'
    });
  }
};

export const create = async (req = request, res = response) => {
  const { name, idOrganization } = req.body;

  try {
    let dbTom = await TypeOfMeeting.findOne({
      where: { name, idOrganization: parseInt(idOrganization, 10) }
    });

    if (dbTom) {
      return res.status(400).json({
        message: 'Ya existe este Tipo de Reunión para esta Organización'
      });
    }

    dbTom = await TypeOfMeeting.create({
      name,
      idOrganization: parseInt(idOrganization, 10)
    });
    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      idOrganization: dbTom.idOrganization
    };
    return res.status(201).json({
      message: 'Tipo de Reunión creado',
      data: tom
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al crear el Tipo de Reunión'
    });
  }
};

export const update = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, idOrganization } = req.body;

  try {
    let dbTom = await TypeOfMeeting.findOne({
      where: { name, idOrganization: parseInt(idOrganization, 10) }
    });

    if (dbTom) {
      return res.status(400).json({
        message: 'Ya existe este Tipo de Reunión para esta Organización'
      });
    }

    await TypeOfMeeting.update({ name }, { where: { id: parseInt(id, 10) } });
    dbTom = await TypeOfMeeting.findByPk(parseInt(id, 10));
    const tom = {
      id: dbTom.id,
      name: dbTom.name,
      idOrganization: dbTom.idOrganization
    };
    return res.json({
      message: 'Tipo de Reunión actualizado',
      data: tom
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mesaage: 'Error al actualizar el Tipo de Reunión'
    });
  }
};

export const remove = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbTom = await TypeOfMeeting.findByPk(parseInt(id, 10));
    const name = `(removed) ${dbTom.name}`;
    await dbTom.update(
      { name, state: false },
      { where: { id: parseInt(id, 10) } }
    );
    return res.json({
      message: 'Tipo de Reunión eliminado'
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Error al eliminar el Tipo de Reunión'
    });
  }
};

export const getMeetings = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbMeetings = await Meeting.findAll({
      where: { idTypeOfMeeting: parseInt(id, 10) }
    });
    const meetings = dbMeetings.map((m) => ({
      id: m.id,
      name: m.name,
      session: m.session,
      date: getDateFromDb(m.date)
    }));
    return res.json({
      data: meetings
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener las Reuniones'
    });
  }
};

export const getAgendas = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgendas = await Agenda.findAll({ where: { idTypeOfMeeting: id } });
    return res.json({ data: dbAgendas });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Error al obtener las Agendas'
    });
  }
};

export const getAllFrom = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbToms = await TypeOfMeeting.findAll({
      where: { idOrganization: parseInt(id) }
    });
    return res.json({
      data: dbToms
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Error al obtener los Tipos de Reuniones'
    });
  }
};
