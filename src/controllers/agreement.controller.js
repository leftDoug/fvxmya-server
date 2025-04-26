import { request, response } from 'express';

import { QueryTypes } from 'sequelize';
import { sequelize } from '../db/config.js';
import { getIdUser } from '../helpers/jwt.js';
import { getDateFromDb, setDateToDb } from '../helpers/utils.js';
import { Agreement } from '../models/Agreement.js';
import { Meeting } from '../models/Meeting.js';
import { Response } from '../models/Response.js';
import { User } from '../models/User.js';

// const getStringDate = (date) => {
//   const tempDate = new Date(date);
//   const YYYY = tempDate.getFullYear();
//   const MM = (tempDate.getMonth() + 1).toString().padStart(2, '0');
//   const DD = tempDate.getDate().toString().padStart(2, '0');

//   return `${YYYY}-${MM}-${DD}`;
// };

export const create = async (req = request, res = response) => {
  const { content, compilanceDate, idMeeting, idResponsible } = req.body;
  const date = setDateToDb(compilanceDate);
  const transaction = await sequelize.transaction();

  try {
    let dbAgreement = await Agreement.findOne({
      where: { content, idMeeting },
      transaction
    });

    if (dbAgreement) {
      return res.status(400).json({
        ok: false,
        message: 'Este acuerdo ya existe en esta reunion.'
      });
    }

    dbAgreement = await Agreement.create(
      {
        content,
        compilanceDate: date,
        idMeeting,
        idResponsible
      },
      { transaction }
    );
    dbAgreement = await Agreement.findByPk(dbAgreement.id, {
      include: [{ model: User, as: 'responsible' }, { model: Meeting }],
      transaction
    });
    const agreement = {
      id: dbAgreement.id,
      number: dbAgreement.number,
      content: dbAgreement.content,
      compilanceDate: getDateFromDb(dbAgreement.compilanceDate),
      state: dbAgreement.state,
      completed: dbAgreement.completed,
      responsible: {
        id: dbAgreement.responsible.id,
        name: dbAgreement.responsible.name
      },
      meeting: {
        id: dbAgreement.meeting.id,
        name: dbAgreement.meeting.name
      },
      responses: []
    };

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Acuerdo creado',
      data: agreement
    });
  } catch (err) {
    console.error(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al crear el Acuerdo'
    });
  }
};

export const update = async (req = request, res = response) => {
  const { id } = req.params;
  const { compilanceDate } = req.body;
  const date = setDateToDb(compilanceDate);
  const transaction = await sequelize.transaction();

  try {
    await Agreement.update(
      { compilanceDate: date },
      { where: { id }, transaction }
    );

    const dbAgreement = await Agreement.findByPk(id, {
      include: [
        { model: User, as: 'responsible' },
        { model: Meeting },
        { model: Response }
      ],
      transaction
    });
    const agreement = {
      id: dbAgreement.id,
      number: dbAgreement.number,
      content: dbAgreement.content,
      compilanceDate: getDateFromDb(dbAgreement.compilanceDate),
      state: dbAgreement.state,
      completed: dbAgreement.completed,
      responsible: {
        id: dbAgreement.responsible.id,
        name: dbAgreement.responsible.name
      },
      meeting: {
        id: dbAgreement.meeting.id,
        name: dbAgreement.meeting.name
      },
      responses: dbAgreement.responses.map((r) => ({
        id: r.id,
        content: r.content
      }))
    };

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Acuerdo actualizado',
      data: agreement
    });
  } catch (err) {
    console.error(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar el Acuerdo'
    });
  }
};

export const getAll = async (req = request, res = response) => {
  try {
    const dbAgreements = await sequelize.query(
      `select * from view_agreements`,
      {
        type: QueryTypes.SELECT
      }
    );

    return res.json({
      ok: true,
      arg: dbAgreements
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al listar los acuerdos.'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgreement = await Agreement.findByPk(id);
    // const dbAgreement = await sequelize.query(
    // 	`select fn_agreement_getinfo('${id}')`,
    // 	{
    // 		type: QueryTypes.SELECT,
    // 	}
    // );

    if (!dbAgreement) {
      return res.status(404).json({
        ok: false,
        msg: 'Acuerdo no encontrado.'
      });
    }

    return res.json({
      ok: true,
      arg: dbAgreement
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al buscar el acuerdo.'
    });
  }
};

export const getInfo = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    // const result = await sequelize.query(
    //   `
    // 	SELECT fn_agreement_getinfo('${id}', 'agreement');
    // 	FETCH ALL IN agreement;
    // 	`,
    //   {
    //     type: QueryTypes.SELECT
    //   }
    // );

    const dbAgreement = await Agreement.findByPk(id, {
      include: [User, Meeting]
    });

    if (!dbAgreement) {
      return res.status(404).json({
        ok: false,
        msg: 'Acuerdo no encontrado'
      });
    }

    const agreement = {
      id: dbAgreement.id,
      number: dbAgreement.number,
      content: dbAgreement.content,
      compilanceDate: getDateFromDb(dbAgreement.compilanceDate),
      completed: dbAgreement.completed,
      state: dbAgreement.state,
      responsible: {
        id: dbAgreement.user.id,
        name: dbAgreement.user.name
      },
      meeting: {
        id: dbAgreement.meeting.id,
        name: dbAgreement.meeting.name
      }
    };

    return res.json({
      ok: true,
      arg: agreement
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al buscar el Acuerdo'
    });
  }
};

export const getResponses = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbResponses = await Response.findAll({ where: { idAgreement: id } });

    return res.status(201).json({
      ok: true,
      arg: dbResponses
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al agregar la respuesta.'
    });
  }
};

export const setCompleted = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await Agreement.update({ completed: true }, { where: { id }, transaction });

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Acuerdo completado'
    });
  } catch (err) {
    console.log(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al completar el Acuerdo'
    });
  }
};

export const setCancelled = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await Agreement.update({ state: false }, { where: { id }, transaction });

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Acuerdo anulado'
    });
  } catch (err) {
    console.log(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al anular el Acuerdo'
    });
  }
};

export const getAllFromUser = async (req = request, res = response) => {
  const { authorization } = req.headers;
  const idUser = getIdUser(authorization);

  try {
    const dbAgreements = await Agreement.findAll({
      where: { idResponsible: idUser },
      include: [User, Meeting]
    });

    const agreements = dbAgreements.map((agreement) => {
      return {
        id: agreement.id,
        number: agreement.number,
        content: agreement.content,
        compilanceDate: agreement.compilanceDate,
        completed: agreement.completed,
        state: agreement.state,
        responsible: {
          id: agreement.user.id,
          name: agreement.user.name
        },
        meeting: {
          id: agreement.meeting.id,
          name: agreement.meeting.name
        }
      };
    });

    return res.json({
      ok: true,
      arg: agreements
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: 'Error al obtener los Acuerdos.'
    });
  }
};

export const getAllFromMeeting = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbAgreements = await Agreement.findAll({
      where: { idMeeting: id },
      include: [{ model: User, as: 'responsible' }, Meeting, Response]
    });
    const agreements = dbAgreements.map((a) => {
      return {
        id: a.id,
        number: a.number,
        content: a.content,
        compilanceDate: getDateFromDb(a.compilanceDate),
        completed: a.completed,
        state: a.state,
        responsible: {
          id: a.responsible.id,
          name: a.responsible.name
        },
        meeting: {
          id: a.meeting.id,
          name: a.meeting.name
        },
        responses: a.responses.map((r) => ({
          id: r.id,
          content: r.content
        }))
      };
    });
    return res.json({
      data: agreements
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Error al obtener los Acuerdos'
    });
  }
};
