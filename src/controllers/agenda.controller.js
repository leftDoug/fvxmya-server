import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { Agenda } from '../models/Agenda.js';
import { Topic } from '../models/Topic.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';

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

export const getAll = async (req = request, res = response) => {
  try {
    const dbAgendas = await Agenda.findAll({
      include: { model: TypeOfMeeting, as: 'typeOfMeeting' }
    });
    const agendas = dbAgendas.map((a) => ({
      id: a.id,
      year: a.year,
      typeOfMeeting: {
        id: a.typeOfMeeting.id,
        name: a.typeOfMeeting.name
      }
    }));
    return res.json({
      data: agendas
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al listar las Agendas'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgenda = await Agenda.findByPk(parseInt(id));
    const agenda = {
      id: dbAgenda.id,
      year: new Date(`01/01/${dbAgenda.year}`),
      idTypeOfMeeting: dbAgenda.idTypeOfMeeting
    };
    return res.json({
      data: agenda
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al buscar la Agenda'
    });
  }
};

export const getTopicsFrom = async (req = request, res = response) => {
  const { id } = req.params;
  const { year } = req.query;

  try {
    const dbAgenda = await Agenda.findOne({
      where: { year, idTypeOfMeeting: parseInt(id) },
      include: Topic
    });

    if (!dbAgenda) {
      return res.status(404).json({
        message: 'No se ha encontrado ninguna Agenda con estos datos'
      });
    }

    const topics = dbAgenda.topics.map((t) => ({
      id: t.id,
      name: t.name
    }));
    return res.json({
      data: topics
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener los Temas'
    });
  }
};

export const getInfo = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgenda = await Agenda.findByPk(id, {
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
      // })).topics.forEach((topic) => {
      //   topic.month = new Date(`${topic.month + 1}/01/${dbAgenda.year}`);
    };

    // dbAgenda.year = new Date(`01/01/${dbAgenda.year}`);

    // const a = {
    //   id: dbAgenda.id,
    //   year: new Date(`01/01/${dbAgenda.year}`),
    //   idTypeOfMeeting: dbAgenda.idTypeOfMeeting
    // };

    return res.json({
      data: agenda
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener datos de la Agenda'
    });
  }
};

export const getTopics = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgenda = await Agenda.findByPk(id);

    if (!dbAgenda) {
      return res.status(404).json({
        ok: false,
        msg: 'Agenda no encontrada.'
      });
    }

    const dbTopics = await dbAgenda.getTopics();

    if (!dbTopics) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontraron Temas en la Agenda.'
      });
    }

    return res.status(200).json({
      ok: true,
      args: dbTopics
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al buscar los Temas de la Agenda'
    });
  }
};

export const remove = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgenda = await Agenda.findByPk(parseInt(id));
    const name = `(removed) ${dbAgenda.name}`;

    await dbAgenda.update({ name, state: false });

    // await Agenda.update({ name, state: false }, { where: { id } });

    return res.json({
      ok: true,
      msg: 'Agenda eliminada'
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al eliminar la Agenda'
    });
  }
};

export const erase = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    await Agenda.destroy({ where: { id: parseInt(id) } });

    return res.json({
      ok: true,
      msg: 'Agenda borrada'
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al borrar la Agenda'
    });
  }
};
