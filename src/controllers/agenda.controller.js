import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { Agenda } from '../models/Agenda.js';
import { Organization } from '../models/Organization.js';
import { Topic } from '../models/Topic.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbAgendas = await Agenda.findAll({
      include: [{ model: TypeOfMeeting, as: 'typeOfMeeting' }, { model: Topic }]
    });
    const agendas = dbAgendas.map((a) => ({
      id: a.id,
      year: new Date(`01/01/${a.year}`),
      typeOfMeeting: {
        id: a.typeOfMeeting.id,
        name: a.typeOfMeeting.name
      },
      topics: a.topics.map((t) => ({
        id: t.id,
        name: t.name,
        month: new Date(`${t.month}/01/${a.year}`),
        monthNumber: t.month - 1
      }))
    }));

    return res.json({
      ok: true,
      data: agendas
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar las Agendas'
    });
  }
};

export const getAllFrom = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbAgendas = await Agenda.findAll({
      where: { idTypeOfMeeting: parseInt(id) },
      include: [{ model: TypeOfMeeting, as: 'typeOfMeeting' }, { model: Topic }]
    });
    const agendas = dbAgendas.map((a) => ({
      id: a.id,
      year: new Date(`01/01/${a.year}`),
      typeOfMeeting: {
        id: a.typeOfMeeting.id,
        name: a.typeOfMeeting.name
      },
      topics: a.topics.map((t) => ({
        id: t.id,
        name: t.name,
        month: new Date(`${t.month}/01/${a.year}`),
        monthNumber: t.month - 1
      }))
    }));

    if (dbAgendas.length > 0) {
      const dbOrganization = await Organization.findByPk(
        dbAgendas[0].typeOfMeeting.idOrganization
      );

      if (idUser !== dbOrganization.idLeader) {
        return res.status(403).json({
          ok: false,
          message: 'Se requiren permisos para acceder a esta información'
        });
      }
    }

    return res.json({
      ok: true,
      data: agendas
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar las Agendas'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbAgenda = await Agenda.findByPk(parseInt(id), {
      include: [{ model: Topic }, { model: TypeOfMeeting, as: 'typeOfMeeting' }]
    });
    const agenda = {
      id: dbAgenda.id,
      year: new Date(`01/01/${dbAgenda.year}`),
      typeOfMeeting: {
        id: dbAgenda.typeOfMeeting.id,
        name: dbAgenda.typeOfMeeting.name
      },
      topics: dbAgenda.topics.map((t) => ({
        id: t.id,
        name: t.name,
        month: new Date(`${t.month}/01/${dbAgenda.year}`),
        monthNumber: t.month - 1
      }))
    };
    const dbOrganization = await Organization.findByPk(
      dbAgenda.typeOfMeeting.idOrganization
    );

    if (idUser !== dbOrganization.idLeader) {
      return res.status(403).json({
        ok: false,
        message: 'Se requiren permisos para acceder a esta información'
      });
    }

    return res.json({
      ok: true,
      data: agenda
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener datos de la Agenda'
    });
  }
};

export const create = async (req = request, res = response) => {
  const { year, idTypeOfMeeting, topics } = req.body;

  if (topics.length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'La Agenda debe contener al menos un Tema'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    let dbAgenda = await Agenda.findOne({
      where: { year, idTypeOfMeeting },
      transaction
    });

    if (dbAgenda) {
      await transaction.commit();
      return res.status(400).json({
        ok: false,
        message:
          'Ya existe una Agenda creada para este Tipo de Reunión este año'
      });
    }

    dbAgenda = await Agenda.create({ year, idTypeOfMeeting }, { transaction });
    await Topic.bulkCreate(
      topics.map((t) => ({
        name: t.name,
        month: t.monthNumber + 1,
        idAgenda: dbAgenda.id
      })),
      { transaction }
    );
    dbAgenda = await Agenda.findByPk(dbAgenda.id, {
      include: [
        { model: Topic },
        { model: TypeOfMeeting, as: 'typeOfMeeting' }
      ],
      transaction
    });
    const agenda = {
      id: dbAgenda.id,
      year: new Date(`01/01/${dbAgenda.year}`),
      typeOfMeeting: {
        id: dbAgenda.typeOfMeeting.id,
        name: dbAgenda.typeOfMeeting.name
      },
      topics: dbAgenda.topics.map((t) => ({
        id: t.id,
        name: t.name,
        month: new Date(`${t.month}/01/${dbAgenda.year}`),
        monthNumber: t.month - 1
      }))
    };
    await transaction.commit();
    return res.status(201).json({
      ok: true,
      message: 'Agenda creada',
      data: agenda
    });
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return res.status(500).json({
      ok: false,
      message: 'Error al crear la Agenda'
    });
  }
};

export const update = async (req = request, res = response) => {
  const { id } = req.params;
  const { topics } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let dbAgenda = await Agenda.findByPk(id, { include: Topic, transaction });
    const newTopics = topics.filter(
      (t) => !dbAgenda.topics.some((t2) => t2.id === t.id)
    );
    await Topic.bulkCreate(
      newTopics.map((t) => ({
        name: t.name,
        month: t.monthNumber + 1,
        idAgenda: dbAgenda.id
      })),
      { transaction }
    );
    dbAgenda = await Agenda.findByPk(dbAgenda.id, {
      include: [
        { model: Topic },
        { model: TypeOfMeeting, as: 'typeOfMeeting' }
      ],
      transaction
    });
    const agenda = {
      id: dbAgenda.id,
      year: new Date(`01/01/${dbAgenda.year}`),
      typeOfMeeting: {
        id: dbAgenda.typeOfMeeting.id,
        name: dbAgenda.typeOfMeeting.name
      },
      topics: dbAgenda.topics.map((t) => ({
        id: t.id,
        name: t.name,
        month: new Date(`${t.month}/01/${dbAgenda.year}`),
        monthNumber: t.month - 1
      }))
    };
    await transaction.commit();
    return res.status(201).json({
      ok: true,
      message: 'Agenda actualizada',
      data: agenda
    });
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar la Agenda.'
    });
  }
};

export const remove = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;
  const transaction = await sequelize.transaction();

  try {
    const dbAgenda = await Agenda.findByPk(
      parseInt(id),
      {
        include: [{ model: TypeOfMeeting, as: 'typeOfMeeting' }]
      },
      transaction
    );
    const dbOrganization = await Organization.findByPk(
      dbAgenda.typeOfMeeting.idOrganization,
      { transaction }
    );

    if (idUser !== dbOrganization.idLeader) {
      await transaction.commit();

      return res.status(403).json({
        ok: false,
        message: 'Se requiren permisos para acceder a esta información'
      });
    }

    await Agenda.destroy({ where: { id: parseInt(id) }, transaction });
    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Agenda borrada'
    });
  } catch (error) {
    console.log(error);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      msg: 'Error al borrar la Agenda'
    });
  }
};
