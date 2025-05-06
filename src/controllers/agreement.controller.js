import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { getDateFromDb, setDateToDb } from '../helpers/utils.js';

import picocolors from 'picocolors';
import { Agreement } from '../models/Agreement.js';
import { Meeting } from '../models/Meeting.js';
import { Organization } from '../models/Organization.js';
import { Response } from '../models/Response.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';
import { User } from '../models/User.js';

export const getAll = async (req = request, res = response) => {
  try {
    const dbAgreements = await Agreement.findAll({
      include: [
        { model: User, as: 'responsible' },
        { model: Response },
        { model: Meeting }
      ]
    });
    const agreements = dbAgreements.map((a) => ({
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
    }));

    return res.json({
      ok: true,
      data: agreements
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar los Acuerdos'
    });
  }
};

export const getAllFrom = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbAgreements = await Agreement.findAll({
      where: { idMeeting: parseInt(id) },
      include: [
        { model: User, as: 'responsible' },
        { model: Response },
        { model: Meeting }
      ]
    });
    const agreements = dbAgreements.map((a) => ({
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
    }));

    if (dbAgreements.length > 0) {
      const tom = await TypeOfMeeting.findByPk(
        dbAgreements[0].meeting.idTypeOfMeeting
      );
      const dbOrganization = await Organization.findByPk(tom.idOrganization);

      if (idUser !== dbOrganization.idLeader) {
        return res.status(403).json({
          ok: false,
          message: 'Se requiren permisos para acceder a esta información'
        });
      }
    }

    return res.json({
      ok: true,
      data: agreements
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar los Acuerdos'
    });
  }
};

export const getAllFromUser = async (req = request, res = response) => {
  // const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbAgreements = await Agreement.findAll({
      where: { idResponsible: idUser },
      include: [
        { model: User, as: 'responsible' },
        { model: Response },
        { model: Meeting }
      ]
    });
    // const dbAgreements = await Agreement.findAll({
    //   where: { idResponsible: id },
    //   include: [
    //     { model: User, as: 'responsible' },
    //     { model: Response },
    //     { model: Meeting }
    //   ]
    // });
    const agreements = dbAgreements.map((a) => ({
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
    }));

    // if (dbAgreements.length > 0) {
    //   if (idUser !== agreements.responsible.id) {
    //     return res.status(403).json({
    //       ok: false,
    //       message: 'Se requiren permisos para acceder a esta información'
    //     });
    //   }
    // }

    return res.json({
      ok: true,
      data: agreements
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar los Acuerdos'
    });
  }
};

export const getAllFromLeader = async (req = request, res = response) => {
  const idUser = req.user.id;

  try {
    const dbOrganizations = await Organization.findAll({
      where: { idLeader: idUser }
    });

    if (dbOrganizations.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    let dbToms = await TypeOfMeeting.findAll();
    let dbMeetings = await Meeting.findAll();
    let dbAgreements = await Agreement.findAll({
      include: [
        { model: User, as: 'responsible' },
        { model: Response },
        { model: Meeting }
      ]
    });

    if (dbOrganizations.length > 1) {
      dbToms = dbOrganizations.forEach((org) => {
        if (dbToms.length > 1) {
          return dbToms.filter((tom) => tom.idOrganization === org.id);
        } else {
          return dbToms[0].idOrganization === org.id ? dbToms : undefined;
        }
      });
    } else if (dbToms.length > 1) {
      dbToms = dbToms.filter(
        (tom) => tom.idOrganization === dbOrganizations[0].id
      );
    } else {
      dbToms =
        dbToms[0].idOrganization === dbOrganizations[0].id
          ? dbToms[0]
          : undefined;
    }

    if (!dbToms) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbToms.length > 1) {
      dbMeetings = dbToms.forEach((tom) => {
        if (dbMeetings.length > 1) {
          return dbMeetings.filter((meet) => meet.idTypeOfMeeting === tom.id);
        } else {
          return dbMeetings[0].idTypeOfMeeting === tom.id
            ? dbMeetings[0]
            : undefined;
        }
      });
    } else if (dbMeetings.length > 1) {
      dbMeetings = dbMeetings.filter(
        (meet) => meet.idTypeOfMeeting === dbToms[0].id
      );
    } else {
      dbMeetings =
        dbMeetings[0].idTypeOfMeeting === dbToms[0].id
          ? dbMeetings[0]
          : undefined;
    }

    if (!dbMeetings) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbMeetings.length > 1) {
      dbAgreements = dbMeetings.forEach((meet) => {
        if (dbAgreements.length > 1) {
          return dbAgreements.filter((agr) => agr.idMeeting === meet.id);
        } else {
          return dbAgreements[0].idMeeting === meet.id
            ? dbAgreements[0]
            : undefined;
        }
      });
    } else if (dbAgreements.length > 1) {
      dbAgreements = dbAgreements.filter(
        (agr) => agr.idMeeting === dbMeetings[0].id
      );
    } else {
      dbAgreements =
        dbAgreements[0].idMeeting === dbMeetings[0].id
          ? dbAgreements[0]
          : undefined;
    }
    console.log(picocolors.greenBright(JSON.stringify(dbAgreements)));
    // console.log(picocolors.greenBright(dbMeetings.length));

    if (!dbAgreements || dbAgreements.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbAgreements.length > 1) {
      const agreements = dbAgreements.map((a) => ({
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
      }));

      return res.json({
        ok: true,
        data: agreements
      });
    }

    const agreement = {
      id: dbAgreements[0].id,
      number: dbAgreements[0].number,
      content: dbAgreements[0].content,
      compilanceDate: getDateFromDb(dbAgreements[0].compilanceDate),
      completed: dbAgreements[0].completed,
      state: dbAgreements[0].state,
      responsible: {
        id: dbAgreements[0].responsible.id,
        name: dbAgreements[0].responsible.name
      },
      meeting: {
        id: dbAgreements[0].meeting.id,
        name: dbAgreements[0].meeting.name
      },
      responses: dbAgreements[0].responses.map((r) => ({
        id: r.id,
        content: r.content
      }))
    };

    return res.json({
      ok: true,
      data: agreement
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar los Acuerdos'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbAgreement = await Agreement.findByPk(id, {
      include: [
        { model: User, as: 'responsible' },
        { model: Response },
        { model: Meeting }
      ]
    });
    const agreement = {
      id: dbAgreement.id,
      number: dbAgreement.number,
      content: dbAgreement.content,
      compilanceDate: getDateFromDb(dbAgreement.compilanceDate),
      completed: dbAgreement.completed,
      state: dbAgreement.state,
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
    const tom = await TypeOfMeeting.findByPk(
      dbAgreement.meeting.idTypeOfMeeting
    );
    const dbOrganization = await Organization.findByPk(tom.idOrganization);

    if (
      idUser !== agreement.responsible.id &&
      idUser !== dbOrganization.idLeader
    ) {
      return res.status(403).json({
        ok: false,
        message: 'Se requiren permisos para acceder a esta información'
      });
    }

    return res.json({
      ok: true,
      data: agreement
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al buscar el Acuerdo'
    });
  }
};

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

    const dbAgreements = await Agreement.findAll({ where: { idMeeting } });

    const number = dbAgreements.length + 1;

    dbAgreement = await Agreement.create(
      {
        number,
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

export const complete = async (req = request, res = response) => {
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

export const cancel = async (req = request, res = response) => {
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
