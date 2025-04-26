import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { getDateFromDb } from '../helpers/utils.js';
import { Agreement } from '../models/Agreement.js';
import { Meeting } from '../models/Meeting.js';
import { Response } from '../models/Response.js';
import { User } from '../models/User.js';

export const create = async (req = request, res = response) => {
  const { idAgreement, content } = req.body;
  const transaction = await sequelize.transaction();

  try {
    await Response.create({ idAgreement, content }, { transaction });

    const dbAgreement = await Agreement.findByPk(idAgreement, {
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

// export const create = async (req = request, res = response) => {
//   const { content, idAgreement } = req.body;

//   try {
//     await Response.create({ content, idAgreement });

//     return res.status(201).json({
//       ok: true,
//       msg: 'Respuesta agregada.'
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al agregar la Respuesta.'
//     });
//   }
// };

export const validate = async (req = request, res = response) => {
  const { id } = req.params;
  const { valid } = req.body;

  try {
    const dbResponse = await Response.findByPk(id);

    dbResponse.update({ valid });
    return res.status(201).json({
      ok: true,
      msg: 'Respuesta revisada.'
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al revisar la Respuesta.'
    });
  }
};

export const getAll = async (req = request, res = response) => {
  try {
    const dbResponses = await Response.findAll();

    return res.json({
      ok: true,
      arg: dbResponses
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al listar las Respuestas.'
    });
  }
};
