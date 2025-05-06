import { request, response } from 'express';

import { Meeting } from '../models/Meeting.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';
// import { Worker } from '../models/Worker.js';
import { Sequelize } from 'sequelize';
// import { WorkerArea } from '../models/WorkerArea.js';
// import { WorkerMeeting } from '../models/WorkerMeeting.js';
import picocolors from 'picocolors';
import { sequelize } from '../db/config.js';
import {
  getDateFromDb,
  getTimeFromDb,
  setDateToDb,
  setTimeToDb
} from '../helpers/utils.js';
import { Agreement } from '../models/Agreement.js';
import { MeetingTopic } from '../models/MeetingTopic.js';
import { MeetingWorker } from '../models/MeetingWorker.js';
import { Organization } from '../models/Organization.js';
import { Topic } from '../models/Topic.js';
import { User } from '../models/User.js';

// TODO revisar
const checkConflict = (newMeeting, dbMeetings) => {
  for (const dbMeeting of dbMeetings) {
    // const dbDate = getDateFromDb(dbMeeting.date);
    const dbStart = getTimeFromDb(dbMeeting.date, dbMeeting.startTime);
    const dbEnd = getTimeFromDb(dbMeeting.date, dbMeeting.endTime);

    // const newDate = new Date(newMeeting.date);
    const newStart = new Date(newMeeting.startTime);
    const newEnd = new Date(newMeeting.endTime);

    newStart.setSeconds(0, 0);
    newEnd.setSeconds(0, 0);

    const timeOverlap =
      (newStart.getTime() < dbStart.getTime() &&
        dbStart.getTime() < newEnd.getTime()) ||
      (newStart.getTime() < dbEnd.getTime() &&
        dbEnd.getTime() < newEnd.getTime()) ||
      (dbStart.getTime() < newStart.getTime() &&
        newEnd.getTime() < dbEnd.getTime());

    // si la reunion se esta actualizando
    // if (newMeeting.id) {}

    if (
      parseInt(newMeeting.idTypeOfMeeting) === dbMeeting.idTypeOfMeeting &&
      (newMeeting.session === dbMeeting.session) === 'Ordinaria'
    ) {
      return 'session';
    }

    if (timeOverlap && newMeeting.session === dbMeeting.session) {
    } else {
    }
  }

  return 'none';
};

export const getAll = async (req = request, res = response) => {
  try {
    const dbMeetings = await Meeting.findAll({
      include: [
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: Topic }
      ]
    });
    const meetings = dbMeetings.map((m) => ({
      id: m.id,
      name: m.name,
      session: m.session,
      date: getDateFromDb(m.date),
      startTime: getTimeFromDb(m.date, m.startTime),
      endTime: getTimeFromDb(m.date, m.endTime),
      status: m.status,
      typeOfMeeting: {
        id: m.typeOfMeeting.id,
        name: m.typeOfMeeting.name
      },
      secretary: {
        id: m.secretary.id,
        name: m.secretary.name,
        occupation: m.secretary.occupation
      },
      participants: m.participants.map((p) => ({
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      })),
      topics: m.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    }));

    return res.json({
      ok: true,
      data: meetings
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener las Reuniones'
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

    if (dbToms.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbToms.length > 1) {
      dbToms = dbToms.filter((tom) => {
        if (dbOrganizations.length > 1) {
          return dbOrganizations.some((org) => org.id === tom.idOrganization);
        }

        return tom.idOrganization === dbOrganizations[0].id;
      });
    } else if (dbOrganizations.length > 1) {
      dbToms = dbOrganizations.some(
        (org) => org.id === dbToms[0].idOrganization
      )
        ? dbToms[0]
        : [];
    } else {
      dbToms =
        dbToms[0].idOrganization === dbOrganizations[0].id ? dbToms[0] : [];
    }

    if (dbToms.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    let dbMeetings = await Meeting.findAll({
      include: [
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: Topic }
      ]
    });

    if (dbMeetings.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbMeetings.length > 1) {
      dbMeetings = dbMeetings.filter((meet) => {
        if (dbToms.length > 1) {
          return dbToms.some((tom) => tom.id === meet.idTypeOfMeeting);
        }

        return meet.idTypeOfMeeting === dbToms[0].id;
      });
    } else if (dbToms.length > 1) {
      dbMeetings = dbToms.some(
        (tom) => tom.id === dbMeetings[0].idTypeOfMeeting
      )
        ? dbMeetings[0]
        : [];
    } else {
      dbMeetings =
        dbMeetings[0].idTypeOfMeeting === dbToms[0].id ? dbMeetings[0] : [];
    }
    console.log(picocolors.greenBright(JSON.stringify(dbMeetings)));
    // console.log(picocolors.greenBright(dbMeetings.length));

    if (dbMeetings.length === 0) {
      return res.json({
        ok: true,
        data: []
      });
    }

    if (dbMeetings.length > 1) {
      const meetings = dbMeetings.map((m) => ({
        id: m.id,
        name: m.name,
        session: m.session,
        date: getDateFromDb(m.date),
        startTime: getTimeFromDb(m.date, m.startTime),
        endTime: getTimeFromDb(m.date, m.endTime),
        status: m.status,
        typeOfMeeting: {
          id: m.typeOfMeeting.id,
          name: m.typeOfMeeting.name
        },
        secretary: {
          id: m.secretary.id,
          name: m.secretary.name,
          occupation: m.secretary.occupation
        },
        participants: m.participants.map((p) => ({
          id: p.id,
          name: p.name,
          occupation: p.occupation,
          member: p.meetingsWorkers.member,
          status: p.meetingsWorkers.status
        })),
        topics: m.topics.map((t) => ({
          id: t.id,
          name: t.name
        }))
      }));

      return res.json({
        ok: true,
        data: meetings
      });
    }

    const meeting = {
      id: dbMeetings[0].id,
      name: dbMeetings[0].name,
      session: dbMeetings[0].session,
      date: getDateFromDb(dbMeetings[0].date),
      startTime: getTimeFromDb(dbMeetings[0].date, dbMeetings[0].startTime),
      endTime: getTimeFromDb(dbMeetings[0].date, dbMeetings[0].endTime),
      status: dbMeetings[0].status,
      typeOfMeeting: {
        id: dbMeetings[0].typeOfMeeting.id,
        name: dbMeetings[0].typeOfMeeting.name
      },
      secretary: {
        id: dbMeetings[0].secretary.id,
        name: dbMeetings[0].secretary.name,
        occupation: dbMeetings[0].secretary.occupation
      },
      participants: dbMeetings[0].participants.map((p) => ({
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      })),
      topics: dbMeetings[0].topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    };

    return res.json({
      ok: true,
      data: [meeting]
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar las Reuniones'
    });
  }
};

export const getAllFromTom = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbMeetings = await Meeting.findAll({
      where: { idTypeOfMeeting: parseInt(id) },
      include: [
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: Topic }
      ]
    });
    const meetings = dbMeetings.map((m) => ({
      id: m.id,
      name: m.name,
      session: m.session,
      date: getDateFromDb(m.date),
      startTime: getTimeFromDb(m.date, m.startTime),
      endTime: getTimeFromDb(m.date, m.endTime),
      status: m.status,
      typeOfMeeting: {
        id: m.typeOfMeeting.id,
        name: m.typeOfMeeting.name
      },
      secretary: {
        id: m.secretary.id,
        name: m.secretary.name,
        occupation: m.secretary.occupation
      },
      participants: m.participants.map((p) => ({
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      })),
      topics: m.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    }));

    if (dbMeetings.length > 0) {
      const dbOrganization = await Organization.findByPk(
        dbMeetings[0].typeOfMeeting.idOrganization
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
      data: meetings
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener las Reuniones'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;
  const idUser = req.user.id;

  try {
    const dbMeeting = await Meeting.findByPk(parseInt(id), {
      include: [
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: Topic }
      ]
    });
    const participants = dbMeeting.participants.map((p) => {
      return {
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      };
    });
    const meeting = {
      id: dbMeeting.id,
      name: dbMeeting.name,
      status: dbMeeting.status,
      session: dbMeeting.session,
      date: getDateFromDb(dbMeeting.date),
      startTime: getTimeFromDb(dbMeeting.date, dbMeeting.startTime),
      endTime: getTimeFromDb(dbMeeting.date, dbMeeting.endTime),
      secretary: {
        id: dbMeeting.secretary.id,
        name: dbMeeting.secretary.name,
        occupation: dbMeeting.secretary.occupation
      },
      typeOfMeeting: {
        id: dbMeeting.typeOfMeeting.id,
        name: dbMeeting.typeOfMeeting.name
      },
      participants,
      topics: dbMeeting.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    };
    const dbOrganization = await Organization.findByPk(
      dbMeeting.typeOfMeeting.idOrganization
    );

    if (idUser !== dbOrganization.idLeader) {
      return res.status(403).json({
        ok: false,
        message: 'Se requiren permisos para acceder a esta información'
      });
    }

    return res.json({
      ok: true,
      data: meeting
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al buscar la Reunión'
    });
  }
};

export const create = async (req = request, res = response) => {
  const {
    name,
    session,
    date,
    startTime,
    endTime,
    idTypeOfMeeting,
    idSecretary,
    members,
    guests,
    topics
  } = req.body;
  const newMeeting = {
    date,
    startTime,
    endTime,
    session,
    idTypeOfMeeting
  };
  const newDate = setDateToDb(date);
  const newStart = setTimeToDb(startTime);
  const newEnd = setTimeToDb(endTime);
  const newParticipants = members
    .map((m) => {
      return { id: m.id, member: true };
    })
    .concat(
      guests.map((g) => {
        return { id: g.id, member: false };
      })
    );
  const transaction = await sequelize.transaction();

  try {
    const dbMeetings = await Meeting.findAll({
      where: { date: newDate },
      transaction
    });

    if (dbMeetings.length > 0) {
      // FIXME revisar x k no esta pinchando esto
      const conflict = checkConflict(newMeeting, dbMeetings);

      switch (conflict) {
        case 'session':
          return res.status(400).json({
            ok: false,
            message:
              'Ya existe una Reunión de este Tipo que coincide en la sesión Ordinaria el mismo día'
          });
        case 'type':
          return res.status(400).json({
            ok: false,
            message:
              'Ya existe una Reunión de este Tipo que coincide con esta en el horario'
          });
        case 'meeting':
          return res.status(400).json({
            ok: false,
            message:
              'Ya existe una Reunión que coincide con esta en nombre, sesión, Tipo y fecha'
          });
        default:
          break;
      }
    }

    let dbMeeting = await Meeting.create(
      {
        name,
        session,
        date: newDate,
        startTime: newStart,
        endTime: newEnd,
        idTypeOfMeeting,
        idSecretary
      },
      { transaction }
    );

    await MeetingWorker.bulkCreate(
      newParticipants.map((p) => {
        return {
          idMeeting: dbMeeting.id,
          idWorker: p.id,
          member: p.member
        };
      }),
      { transaction }
    );

    await MeetingTopic.bulkCreate(
      topics.map((t) => {
        return {
          idMeeting: dbMeeting.id,
          idTopic: t.id
        };
      }),
      { transaction }
    );

    dbMeeting = await Meeting.findByPk(dbMeeting.id, {
      include: [
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: Topic }
      ],
      transaction
    });
    const participants = dbMeeting.participants.map((p) => {
      return {
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      };
    });
    const meeting = {
      id: dbMeeting.id,
      name: dbMeeting.name,
      status: dbMeeting.status,
      session: dbMeeting.session,
      date: dbMeeting.date,
      startTime: getTimeFromDb(dbMeeting.date, dbMeeting.startTime),
      endTime: getTimeFromDb(dbMeeting.date, dbMeeting.endTime),
      secretary: {
        id: dbMeeting.secretary.id,
        name: dbMeeting.secretary.name,
        occupation: dbMeeting.secretary.occupation
      },
      typeOfMeeting: {
        id: dbMeeting.typeOfMeeting.id,
        name: dbMeeting.typeOfMeeting.name
      },
      participants,
      topics: dbMeeting.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    };

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Reunión creada',
      data: meeting
    });
  } catch (err) {
    console.error(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al crear la Reunión'
    });
  }
};

export const update = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    name,
    session,
    date,
    startTime,
    endTime,
    idTypeOfMeeting,
    idSecretary,
    members,
    guests,
    topics
  } = req.body;
  const newMeeting = {
    date,
    startTime,
    endTime,
    session,
    idTypeOfMeeting
  };
  const newDate = setDateToDb(date);
  const newStart = setTimeToDb(startTime);
  const newEnd = setTimeToDb(endTime);
  const tempParticipants = members
    .map((m) => {
      return { id: m.id, member: true };
    })
    .concat(
      guests.map((g) => {
        return { id: g.id, member: false };
      })
    );
  const transaction = await sequelize.transaction();

  try {
    let dbMeeting = await Meeting.findByPk(parseInt(id), {
      include: [{ model: User, as: 'participants' }, { model: Topic }],
      transaction
    });
    const dbMeetings = await Meeting.findAll({
      where: { date: newDate },
      transaction
    });

    if (dbMeetings.length > 0) {
      // FIXME revisar x k no pincha
      const conflict = checkConflict(newMeeting, dbMeetings);

      switch (conflict) {
        case 'session':
          return res.status(400).json({
            ok: false,
            message:
              'Ya existe una Reunión de este Tipo que coincide en la sesión Ordinaria el mismo día.'
          });
        default:
          break;
      }
    }

    const newParticipants = tempParticipants.filter(
      (p) => !dbMeeting.participants.some((p2) => p2.id === p.id)
    );
    const rmParticipants = dbMeeting.participants
      .filter((p) => !tempParticipants.some((p2) => p2.id === p.id))
      .map((p3) => p3.id);
    const rmTopics = dbMeeting.topics
      .filter((t) => !topics.some((t2) => t2.id === t.id))
      .map((t3) => t3.id);
    const newTopics = topics
      .filter((t) => !dbMeeting.topics.some((t2) => t2.id === t.id))
      .map((t3) => t3.id);

    // FIXME se puede evitar hacer el update si no se ha modificado
    await dbMeeting.update(
      {
        name,
        session,
        date: newDate,
        startTime: newStart,
        endTime: newEnd,
        idSecretary
      },
      { transaction }
    );

    if (rmParticipants.length > 0) {
      await MeetingWorker.destroy({
        where: {
          idMeeting: id,
          idWorker: rmParticipants
        },
        transaction
      });
    }

    if (newParticipants.length > 0) {
      await MeetingWorker.bulkCreate(
        newParticipants.map((p) => {
          return {
            idMeeting: parseInt(id),
            idWorker: p.id,
            member: p.member
          };
        }),
        { transaction }
      );
    }

    if (rmTopics.length > 0) {
      await MeetingTopic.destroy({
        where: {
          idMeeting: parseInt(id),
          idTopic: rmTopics
        },
        transaction
      });
    }

    if (newTopics.length > 0) {
      await MeetingTopic.bulkCreate(
        newTopics.map((t) => ({
          idMeeting: parseInt(id),
          idTopic: t
        })),
        { transaction }
      );
    }

    dbMeeting = await Meeting.findByPk(parseInt(id), {
      include: [
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: Topic }
      ],
      transaction
    });
    const participants = dbMeeting.participants.map((p) => {
      return {
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      };
    });
    const meeting = {
      id: dbMeeting.id,
      name: dbMeeting.name,
      status: dbMeeting.status,
      session: dbMeeting.session,
      date: dbMeeting.date,
      startTime: getTimeFromDb(dbMeeting.date, dbMeeting.startTime),
      endTime: getTimeFromDb(dbMeeting.date, dbMeeting.endTime),
      secretary: {
        id: dbMeeting.secretary.id,
        name: dbMeeting.secretary.name,
        occupation: dbMeeting.secretary.occupation
      },
      typeOfMeeting: {
        id: dbMeeting.typeOfMeeting.id,
        name: dbMeeting.typeOfMeeting.name
      },
      participants,
      topics: dbMeeting.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    };

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Reunion actualizada',
      data: meeting
    });
  } catch (err) {
    console.error(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar la Reunión'
    });
  }
};

export const setAttendance = async (req = request, res = response) => {
  const { id } = req.params;
  const { attendants } = req.body;

  const transaction = await sequelize.transaction();

  try {
    await MeetingWorker.update(
      { status: 'PRESENTE' },
      {
        where: {
          idMeeting: parseInt(id),
          idWorker: { [Sequelize.Op.in]: attendants },
          status: { [Sequelize.Op.ne]: 'PRESENTE' }
        },
        transaction
      }
    );

    await MeetingWorker.update(
      { status: 'AUSENTE' },
      {
        where: {
          idMeeting: parseInt(id),
          idWorker: { [Sequelize.Op.notIn]: attendants },
          status: { [Sequelize.Op.ne]: 'AUSENTE' }
        },
        transaction
      }
    );

    const dbMeeting = await Meeting.findByPk(parseInt(id), {
      include: [
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: Topic }
      ],
      transaction
    });
    const meeting = {
      id: dbMeeting.id,
      name: dbMeeting.name,
      session: dbMeeting.session,
      date: getDateFromDb(dbMeeting.date),
      startTime: getTimeFromDb(dbMeeting.date, dbMeeting.startTime),
      endTime: getTimeFromDb(dbMeeting.date, dbMeeting.endTime),
      status: dbMeeting.status,
      typeOfMeeting: {
        id: dbMeeting.typeOfMeeting.id,
        name: dbMeeting.typeOfMeeting.name
      },
      secretary: {
        id: dbMeeting.secretary.id,
        name: dbMeeting.secretary.name
      },
      participants: dbMeeting.participants.map((p) => ({
        id: p.id,
        name: p.name,
        occupation: p.occupation,
        member: p.meetingsWorkers.member,
        status: p.meetingsWorkers.status
      })),
      topics: dbMeeting.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    };

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Asistencia registrada',
      data: meeting
    });
  } catch (err) {
    console.log(err);
    transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al registrar la asistencia'
    });
  }
};

export const open = async (req = request, res = response) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    await Meeting.update(
      { status: 'EN PROCESO' },
      {
        where: { id },
        transaction
      }
    );

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'La Reunión ahora está abierta'
    });
  } catch (error) {
    console.log(error);
    transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al abrir la Reunión'
    });
  }
};

export const close = async (req = request, res = response) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    await Meeting.update(
      { status: 'COMPLETADA' },
      {
        where: { id },
        transaction
      }
    );

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'La Reunión ahora está cerrada'
    });
  } catch (err) {
    console.log(err);
    transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al cerrar la Reunión'
    });
  }
};

// TODO falta hacer el remove
export const remove = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await Agreement.update(
      { state: false },
      {
        where: { idMeeting: parseInt(id) },
        transaction
      }
    );

    await Meeting.destroy({
      where: { id },
      transaction
    });

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Reunión eliminada'
    });
  } catch (err) {
    console.error(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar la Reunión'
    });
  }
};
