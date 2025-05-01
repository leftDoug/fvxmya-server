import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { getDateFromDb } from '../helpers/utils.js';
import { Agreement } from '../models/Agreement.js';
import { Meeting } from '../models/Meeting.js';
import { Response } from '../models/Response.js';
import { User } from '../models/User.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbResponses = await Response.findAll({ include: Agreement });
    const responses = dbResponses.map((r) => ({
      id: r.id,
      content: r.content,
      agreement: {
        id: r.agreement.id,
        content: r.agreement.content
      }
    }));

    return res.json({
      ok: true,
      data: responses
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar las Respuestas'
    });
  }
};

export const create = async (req = request, res = response) => {
  const { idAgreement, content } = req.body;
  const idUser = req.user.id;
  const transaction = await sequelize.transaction();

  try {
    const dbAgreement = await Agreement.findByPk(idAgreement, {
      include: [
        { model: User, as: 'responsible' },
        { model: Meeting },
        { model: Response }
      ],
      transaction
    });

    if (idUser !== dbAgreement.idResponsible) {
      await transaction.commit();

      return res.status(403).json({
        ok: false,
        message: 'Se requieren permisos para realizar esta acción'
      });
    }

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
    const newResponse = await Response.create(
      { idAgreement, content },
      { transaction }
    );
    agreement.responses = [
      ...agreement.responses,
      {
        id: newResponse.id,
        content: newResponse.content
      }
    ];

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Respuesta agregada',
      data: agreement
    });
  } catch (err) {
    console.log(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al agregar la Respuesta'
    });
  }
};
