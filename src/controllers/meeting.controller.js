import { request, response } from 'express';

import { Meeting } from '../models/Meeting.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';
// import { Worker } from '../models/Worker.js';
import { Sequelize } from 'sequelize';
// import { WorkerArea } from '../models/WorkerArea.js';
// import { WorkerMeeting } from '../models/WorkerMeeting.js';
import { sequelize } from '../db/config.js';
import {
  getDateFromDb,
  getTimeFromDb,
  setDateToDb,
  setTimeToDb
} from '../helpers/utils.js';
import { MeetingTopic } from '../models/MeetingTopic.js';
import { MeetingWorker } from '../models/MeetingWorker.js';
import { Organization } from '../models/Organization.js';
import { Topic } from '../models/Topic.js';
import { User } from '../models/User.js';

// DB <-- (year)-(month+1)-(day)
// DB --> (year)-(month+1)-(day) => (month)/(day)/(year)

// const getDbTime = (dbTime, date) => {
//   const [hours, minutes] = dbTime.split(':');
//   const time = new Date(date);

//   time.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10));

//   return time;
// };

// const getTime = (date) => {
//   const time = new Date(date);

//   time.setSeconds(0);
//   time.setMilliseconds(0);

//   return time;
// };

// const checkConflictsx = async (
//   newMeeting,
//   dbMeetings,
//   dbWorkersId,
//   workers = false,
//   idWorkers = null
// ) => {
//   dbMeetings.forEach((meeting) => {
//     const [year, month, day] = meeting.date.split('-');
//     const dbDate = new Date(
//       Number.parseInt(year, 10),
//       Number.parseInt(month, 10) - 1,
//       Number.parseInt(day, 10)
//     );

//     const dbStart = getDbTime(meeting.startTime, dbDate);
//     // let [hours, minutes] = meeting.startTime.split(':');
//     // const dbStart = new Date(dbDate);
//     // dbStart.setHours(Number.parseInt(hours,10),Number.parseInt(minutes,10));
//     // dbStart.setMinutes(Number.parseInt(minutes,10));

//     const dbEnd = getDbTime(meeting.endTime, dbDate);
//     // [hours, minutes] = meeting.endTime.split(':');
//     // const dbEnd = new Date(dbDate);
//     // dbEnd.setHours(Number.parseInt(hours,10),Number.parseInt(minutes,10));
//     // dbEnd.setMinutes(Number.parseInt(minutes,10));

//     const newStart = getTime(newMeeting.startTime);
//     // const newStart = new Date(newMeeting.startTime);
//     // newStart.setSeconds(0);
//     // newStart.setMilliseconds(0);

//     const newEnd = getTime(newMeeting.endTime);
//     // const newEnd = new Date(newMeeting.endTime);
//     // newEnd.setSeconds(0);
//     // newEnd.setMilliseconds(0);

//     const timeOverlap =
//       (dbStart.getTime() <= newStart.getTime() &&
//         dbEnd.getTime() >= newStart.getTime()) ||
//       (dbStart.getTime() <= newEnd.getTime() &&
//         dbEnd.getTime() >= newEnd.getTime()) ||
//       (dbStart.getTime() <= newStart.getTime() &&
//         dbEnd.getTime() >= newEnd.getTime()) ||
//       (dbStart.getTime() >= newStart.getTime() &&
//         dbEnd.getTime() <= newEnd.getTime());
//     // const dbWorkers = await meeting.getWorkers();

//     if (timeOverlap) {
//       console.log(picocolors.bgRed(picocolors.bold('coincide la hora')));

//       const hasCoincidence = dbWorkersId.some(
//         (wm) =>
//           wm.idMeeting === meeting.id && wm.idWorker === newMeeting.idSecretary
//       );

//       if (meeting.idSecretary === newMeeting.idSecretary || hasCoincidence) {
//         console.log(
//           picocolors.bgRed(picocolors.bold('coincide el secretario'))
//         );

//         // return res.status(400).json({
//         //   ok: false,
//         //   msg: 'El secretario de acta debe asistir a otra reunión en este horario.'
//         // });
//         return 'secretary';
//       }

//       // if (meeting.idSecretary === newMeeting.idSecretary) {
//       //   console.log(
//       //     picocolors.bgRed(picocolors.bold('coincide el secretario'))
//       //   );

//       //   // return res.status(400).json({
//       //   //   ok: false,
//       //   //   msg: 'El secretario de acta debe asistir a otra reunión en este horario.'
//       //   // });
//       //   resolve('secretary');
//       // }

//       if (workers) {
//         console.log('tiene trabajadorese');

//         // const coincidence = dbWorkers.find((worker) =>
//         //   idWorkers.find((id) => id === worker.id)
//         // );

//         // const dbWorkersId = dbWorkers.map((worker) => worker.id);
//         const hasCoincidence = dbWorkersId.some(
//           (wm) => wm.idMeeting === meeting.id && idWorkers.include(wm.idWorker)
//         );

//         if (hasCoincidence) {
//           console.log('coinciden los trabajadores');

//           // return res.status(400).json({
//           //   ok: false,
//           //   msg: 'Existen trabajadores que deben asistir a otra reunión en este horario.'
//           // });
//           return 'workers';
//         }
//       } else {
//         console.log(picocolors.bgRed(picocolors.bold('no tiene trabajadores')));

//         // const typeOfMeeting = await meeting.getTypeOfMeeting();
//         // FIXME ver si pueden coincidir reuniones del mismo tipo
//         if (meeting.idTypeOfMeeting === newMeeting.idTypeOfMeeting) {
//           console.log(
//             picocolors.bgRed(picocolors.bold('coincide el tipo de reunion'))
//           );

//           // return res.status(400).json({
//           //   ok: false,
//           //   msg: 'Ya existe una Reunión de este Tipo que coincide con esta en el horario.'
//           // });
//           return 'type';
//         }
//       }
//     } else {
//       console.log('no coincide la hora');
//       // FIXME ver si pueden coincidir reuniones de la misma sesion aunque sea extraordinaria (cambiar la comparacion a ordinaria solo)
//       if (
//         meeting.name === newMeeting.name &&
//         meeting.session === newMeeting.session &&
//         meeting.idTypeOfMeeting === newMeeting.idTypeOfMeeting
//       ) {
//         console.log('coincide el nombre con otra del mismo tipo y sesion');

//         // return res.status(400).json({
//         //   ok: false,
//         //   msg: 'Ya existe una Reunión que coincide con esta en nombre, sesión, Tipo y fecha'
//         // });
//         return 'meeting';
//       }
//     }
//   });

//   return null;
// };

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

// const checkConflicts = (
//   newMeeting,
//   dbMeetings,
//   dbWorkersId,
//   workers = false,
//   idWorkers = null
// ) => {
//   for (const meeting of dbMeetings) {
//     const [year, month, day] = meeting.date.split('-');
//     let dbDate = new Date(
//       Number.parseInt(year, 10),
//       Number.parseInt(month, 10) - 1,
//       Number.parseInt(day, 10)
//     );

//     const dbStart = getDbTime(meeting.startTime, dbDate);
//     const dbEnd = getDbTime(meeting.endTime, dbDate);

//     if (newMeeting.id) {
//       const [year, month, day] = meeting.date.split('-');
//       dbDate = new Date(
//         Number.parseInt(year, 10),
//         Number.parseInt(month, 10) - 1,
//         Number.parseInt(day, 10)
//       );
//     }

//     const newStart = newMeeting.id
//       ? getTime(newMeeting.startTime)
//       : getDbTime(newMeeting.startTime, dbDate);
//     const newEnd = newMeeting.id
//       ? getTime(newMeeting.endTime)
//       : getDbTime(newMeeting.endTime, dbDate);

//     const timeOverlap =
//       (dbStart.getTime() <= newStart.getTime() &&
//         dbEnd.getTime() >= newStart.getTime()) ||
//       (dbStart.getTime() <= newEnd.getTime() &&
//         dbEnd.getTime() >= newEnd.getTime()) ||
//       (dbStart.getTime() <= newStart.getTime() &&
//         dbEnd.getTime() >= newEnd.getTime()) ||
//       (dbStart.getTime() >= newStart.getTime() &&
//         dbEnd.getTime() <= newEnd.getTime());

//     if (timeOverlap) {
//       if (workers) {
//         console.log('tiene trabajadorese');

//         const workersConflict = dbWorkersId.some(
//           (wm) => wm.idMeeting === meeting.id && idWorkers.include(wm.idWorker)
//         );

//         if (workersConflict) {
//           console.log('coinciden los trabajadores');

//           return 'workers';
//         }
//       } else {
//         const hasCoincidence = dbWorkersId.some(
//           (wm) =>
//             wm.idMeeting === meeting.id &&
//             wm.idWorker === newMeeting.idSecretary
//         );

//         if (meeting.idSecretary === newMeeting.idSecretary || hasCoincidence) {
//           return 'secretary';
//         }

//         // FIXME ver si pueden coincidir reuniones del mismo tipo
//         if (meeting.idTypeOfMeeting === newMeeting.idTypeOfMeeting) {
//           return 'type';
//         }
//       }
//     } else {
//       if (!workers) {
//         // FIXME ver si pueden coincidir reuniones de la misma sesion aunque sea extraordinaria (cambiar la comparacion a ordinaria solo). poner una solo para k no puedan exixtir reuniones con el mismo nombre el mismo dia
//         if (
//           meeting.name === newMeeting.name &&
//           meeting.session === newMeeting.session &&
//           meeting.idTypeOfMeeting === newMeeting.idTypeOfMeeting
//         ) {
//           return 'meeting';
//         }
//       }
//     }
//   }

//   return null;
// };

// const getStringDate = (date) => {
//   const tempDate = new Date(date);
//   const YYYY = tempDate.getFullYear();
//   const MM = (tempDate.getMonth() + 1).toString().padStart(2, '0');
//   const DD = tempDate.getDate().toString().padStart(2, '0');

//   return `${YYYY}-${MM}-${DD}`;
// };

// const getStringTime = (date) => {
//   const tempDate = new Date(date);
//   const hours = tempDate.getHours().toString().padStart(2, '0');
//   const minutes = tempDate.getMinutes().toString().padStart(2, '0');

//   return `${hours}:${minutes}:00`;
// };

// export const createx = (req = request, res = response) => {
//   let {
//     name,
//     session,
//     date,
//     startTime,
//     endTime,
//     idTypeOfMeeting,
//     idSecretary
//   } = req.body;

//   date = new Date(date);

//   const YYYY = date.getFullYear();
//   const MM = date.getMonth().toString().padStart(2, '0');
//   const DD = date.getDate().toString().padStart(2, '0');
//   const fecha = `${YYYY}-${MM}-${DD}`;
//   const [x, y, z] = fecha.split('-');

//   console.log(picocolors.red(z));

//   const hh = date.getHours().toString().padStart(2, '0');
//   const mm = date.getMinutes().toString().padStart(2, '0');
//   const ss = date.getSeconds().toString().padStart(2, '0');
//   const hora = `${hh}:${mm}:${ss}`;

//   const salida = new Date(YYYY, Number.parseInt(MM), Number.parseInt(DD));

//   console.log('date entrada:', picocolors.blue(picocolors.bold(date)));
//   console.log('date salida:', picocolors.blue(picocolors.bold(salida)));
//   console.log('fecha entrada:', picocolors.blue(picocolors.bold(fecha)));
//   console.log('hora entrada:', picocolors.blue(picocolors.bold(hora)));
// };

// export const create = async (req = request, res = response) => {
//   const {
//     name,
//     session,
//     date,
//     startTime,
//     endTime,
//     idTypeOfMeeting,
//     idSecretary
//   } = req.body;

//   const newDate = getStringDate(date);
//   const newStartTime = getStringTime(startTime);
//   const newEndTime = getStringTime(endTime);
//   const parsedTypeId = parseInt(idTypeOfMeeting, 10);
//   const parsedSecretaryId = parseInt(idSecretary, 10);

//   const newMeeting = {
//     name,
//     session,
//     date,
//     startTime,
//     endTime,
//     idTypeOfMeeting: parsedTypeId,
//     idSecretary: parsedSecretaryId
//   };

//   try {
//     const dbMeetings = await Meeting.findAll({ where: { date: newDate } });
//     const dbWorkersId = [];

//     dbMeetings.forEach(async (meeting) => {
//       const workMeet = await WorkerMeeting.findAll({
//         where: { idMeeting: meeting.id }
//       });
//       const idWorkers = workMeet.map((wm) => {
//         wm.idMeeting, wm.idWorker;
//       });

//       dbWorkersId.push(idWorkers);
//     });

//     if (dbMeetings) {
//       const conflict = checkConflicts(newMeeting, dbMeetings, dbWorkersId);

//       switch (conflict) {
//         case 'type':
//           return res.status(400).json({
//             ok: false,
//             msg: 'Ya existe una Reunión de este Tipo que coincide con esta en el horario.'
//           });
//         case 'secretary':
//           return res.status(400).json({
//             ok: false,
//             msg: 'El secretario de acta debe asistir a otra reunión en este horario.'
//           });
//         case 'meeting':
//           return res.status(400).json({
//             ok: false,
//             msg: 'Ya existe una Reunión que coincide con esta en nombre, sesión, Tipo y fecha.'
//           });
//         default:
//           break;
//       }
//     }

//     await Meeting.create({
//       name,
//       session,
//       date: newDate,
//       startTime: newStartTime,
//       endTime: newEndTime,
//       idTypeOfMeeting: parsedTypeId,
//       idSecretary: parsedSecretaryId
//     });

//     res.status(201).json({
//       ok: true,
//       msg: 'Reunión creada.'
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al crear la Reunión.'
//     });
//   }
// };

// export const addWorkers = async (req = request, res = response) => {
//   const { id } = req.params;
//   const { idWorkers } = req.body;

//   try {
//     const dbMeeting = await Meeting.findByPk(id);
//     const dbMeetings = await Meeting.findAll({
//       where: { date: dbMeeting.date }
//     });
//     const dbWorkersId = [];

//     const filteredMeetings = dbMeetings.filter(
//       (meeting) => dbMeeting.id !== meeting.id
//     );

//     filteredMeetings.forEach(async (meeting) => {
//       const workMeet = await WorkerMeeting.findAll({
//         where: { idMeeting: meeting.id }
//       });
//       const idWorkers = workMeet.map((wm) => {
//         wm.idMeeting, wm.idWorker;
//       });

//       dbWorkersId.push(idWorkers);
//     });

//     if (filteredMeetings) {
//       const conflict = checkConflicts(
//         dbMeeting,
//         filteredMeetings,
//         dbWorkersId,
//         true,
//         idWorkers
//       );
//     }

//     if (conflict) {
//       return res.status(400).json({
//         ok: false,
//         msg: 'Existen trabajadores que deben asistir a otra reunión en este horario.'
//       });
//     }

//     idWorkers.forEach(async (idWorker) => {
//       await WorkerMeeting.create({ idMeeting: id, idWorker });
//     });

//     return res.json({
//       ok: true,
//       msg: 'Trabajadores agregados.'
//     });
//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al agregar los trabajadores.'
//     });
//   }
// };

// export const update = async (req = request, res = response) => {
//   const { id } = req.params;
//   const {
//     name,
//     session,
//     date,
//     startTime,
//     endTime,
//     idTypeOfMeeting,
//     idSecretary,
//     state,
//     workers
//   } = req.body;

//   try {
//     const dbMeetings = await Meeting.findAll({ where: { date } });
//     // const dbTypeOfMeeting = await TypeOfMeeting.findByPk(idTypeOfMeeting);
//     debugger;
//     if (dbMeetings.length >= 1) {
//       // for (let index = 0; index < dbMeetings.length; index++) {
//       //   const element = dbMeetings[index];
//       //   const dbStart = new Date(element.startTime);
//       //   const dbEnd = new Date(element.endTime);
//       //   const newStart = new Date(startTime);
//       //   const newEnd = new Date(endTime);

//       //   if (
//       //     (dbStart.getTime() <= newStart.getTime() &&
//       //       dbEnd.getTime() >= newStart.getTime()) ||
//       //     (dbStart.getTime() <= newEnd.getTime() &&
//       //       dbEnd.getTime() >= newEnd.getTime())
//       //   ) {
//       //     const typeOfMeeting = await TypeOfMeeting.findByPk(
//       //       element.idTypeOfMeeting
//       //     );

//       //     if (dbTypeOfMeeting.idArea === typeOfMeeting.idArea) {
//       //       return res.status(400).json({
//       //         ok: false,
//       //         msg: 'Ya existe una reunión que coincide con esta en horario y área'
//       //       });
//       //     }
//       //   }

//       //   if (
//       //     element.name === name &&
//       //     element.session === session &&
//       //     element.idTypeOfMeeting === idTypeOfMeeting
//       //   ) {
//       //     return res.status(400).json({
//       //       ok: false,
//       //       msg: 'Ya existe una reunión que coincide con esta en nombre, sesión, tipo y fecha'
//       //     });
//       //   }
//       // }

//       checkConflicts(
//         dbMeetings,
//         name,
//         session,
//         startTime,
//         endTime,
//         idTypeOfMeeting,
//         idSecretary,
//         workers
//       );
//     }

//     // if ((dbMeetings.length === 1 && dbMeetings[0].id === id)||!dbMeetings) {
//     const dbMeeting = await Meeting.findByPk(id);

//     dbMeeting.update({
//       name,
//       session,
//       date,
//       startTime,
//       endTime,
//       idTypeOfMeeting,
//       idSecretary,
//       state
//     });

//     return res.json({
//       ok: true,
//       msg: 'Reunion actualizada.'
//     });
//     // }

//     // await Meeting.update(
//     //   {
//     //     name,
//     //     session,
//     //     date,
//     //     startTime,
//     //     endTime,
//     //     idTypeOfMeeting,
//     //     idSecretary,
//     //     state
//     //   },
//     //   { where: { id } }
//     // );

//     // return res.json({
//     //   ok: true,
//     //   msg: 'Reunión actualizada'
//     // });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al actualizar la Reunión.'
//     });
//   }
// };

export const getAgreements = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbMeeting = await Meeting.findByPk(id);
    const dbAgreements = await dbMeeting.getAgreements({
      include: [User, Meeting]
    });
    // const dbAgreements = await Agreement.findAll({ where: { idMeeting: id } });

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

export const getAllFrom = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbMeetings = await Meeting.findAll({
      where: { idTypeOfMeeting: id },
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

// export const getAll = async (req = request, res = response) => {
//   try {
//     const dbMeetings = await Meeting.findAll();

//     return res.json({
//       data: dbMeetings
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: 'Error al obtener las Reuniones'
//     });
//   }
// };

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbMeeting = await Meeting.findByPk(id);

    if (!dbMeeting) {
      return res.status(404).json({
        ok: false,
        msg: 'Reunión no encontrada.'
      });
    }

    dbMeeting.startTime = getTimeFromDb(dbMeeting.date, dbMeeting.startTime);
    dbMeeting.endTime = getTimeFromDb(dbMeeting.date, dbMeeting.endTime);

    return res.json({
      ok: true,
      arg: dbMeeting
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al buscar la Reunión.'
    });
  }
};

export const getInfo = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbMeeting = await Meeting.findByPk(id, {
      include: [
        { model: TypeOfMeeting, as: 'typeOfMeeting' },
        { model: User, as: 'secretary' },
        { model: User, as: 'participants' },
        { model: Topic }
      ]
    });
    const organization = await dbMeeting.typeOfMeeting.getOrganization();
    const participants = dbMeeting.participants.map((worker) => {
      return {
        id: worker.id,
        name: worker.name,
        occupation: worker.occupation,
        member: worker.meetingsWorkers.member,
        status: worker.meetingsWorkers.status
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
        id: dbMeeting.idSecretary,
        name: dbMeeting.secretary.name,
        occupation: dbMeeting.secretary.occupation
      },
      typeOfMeeting: {
        id: dbMeeting.idTypeOfMeeting,
        name: dbMeeting.typeOfMeeting.name
      },
      organization: {
        id: organization.id,
        name: organization.name
      },
      participants,
      topics: dbMeeting.topics.map((t) => ({
        id: t.id,
        name: t.name
      }))
    };
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

// export const getInfo = async (req = request, res = response) => {
//   const { id } = req.params;

//   try {
//     const dbMeeting = await Meeting.findByPk(id);
//     const result = await sequelize.query(
//       `
//       SELECT fn_meeting_getinfo(:id, 'dbmeeting');
//       FETCH ALL IN dbmeeting;
//       `,
//       {
//         replacements: { id: parseInt(id) },
//         type: QueryTypes.SELECT
//       }
//     );

//     const meeting = result[1];
//     meeting.startTime = getTimeFromDb(meeting.date, meeting.startTime);
//     meeting.endTime = getTimeFromDb(meeting.date, meeting.endTime);

//     const organization = await sequelize.query(
//       `
//       SELECT organizations."id",
//         organizations."name",
//         organizations."idLeader"
//       FROM meetings
//         JOIN "typesOfMeetings" ON meetings."idTypeOfMeeting" = "typesOfMeetings"."id"
//         JOIN "organizations" ON "typesOfMeetings"."idOrganization" = organizations."id"
//       WHERE meetings."id" = :id;
//       `,
//       {
//         replacements: { id },
//         type: QueryTypes.SELECT
//       }
//     );

//     meeting.organization = organization[0];
//     meeting.typeOfMeeting = {
//       id: dbMeeting.idTypeOfMeeting,
//       name: meeting.typeOfMeeting
//     };

//     return res.json({
//       ok: true,
//       arg: meeting
//     });
//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al buscar la Reunión.'
//     });
//   }
// };

// export const getParticipants = async (req = request, res = response) => {
//   const { id } = req.params;

//   try {
//     const result = await sequelize.query(
//       `
//       SELECT fn_meeting_getparticipants(:id,'dbworkers');
//       FETCH ALL IN dbworkers;
//       `,
//       {
//         replacements: { id: id },
//         type: QueryTypes.SELECT
//       }
//     );

//     const participants = result.slice(1);

//     return res.json({
//       ok: true,
//       arg: participants
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       ok: true,
//       msg: 'Error al obtener los participantes'
//     });
//   }
// };

// export const getAbsents = async (req = request, res = response) => {
//   const { id } = req.params;

//   try {
//     const result = await sequelize.query(
//       `
//       SELECT fn_meeting_getabsents(:id,'dbworkers');
//       FETCH ALL IN dbworkers;
//       `,
//       {
//         replacements: { id: id },
//         type: QueryTypes.SELECT
//       }
//     );

//     const absents = result.slice(1);

//     return res.json({
//       ok: true,
//       arg: absents
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       ok: true,
//       msg: 'Error al obtener los ausentes'
//     });
//   }
// };

// export const getOrganization = async (req = request, res = response) => {
//   const { id } = req.params;

//   try {
//     const dbMeeting = await Meeting.findByPk(id);
//     const result = await sequelize.query(
//       `
//       SELECT organizations."name"
//       FROM meetings
//         JOIN "typesOfMeetings" ON meetings."idTypeOfMeeting" = "typesOfMeetings"."id"
//         JOIN "organizations" ON "typesOfMeetings"."idOrganization" = organizations."id"
//       WHERE meetings."id" = :id;
//       `,
//       {
//         replacements: { id },
//         type: QueryTypes.SELECT
//       }
//     );

//     return res.json({
//       ok: true,
//       arg: dbMeeting
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al obtener la Organización'
//     });
//   }
// };

// TODO todas las acciones deben ser asi
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

// export const create = async (req = request, res = response) => {
//   const {
//     name,
//     session,
//     date,
//     startTime,
//     endTime,
//     idTypeOfMeeting,
//     idSecretary,
//     members,
//     guests,
//     topics
//   } = req.body;

//   const newMeeting = {
//     date,
//     startTime,
//     endTime,
//     session,
//     idTypeOfMeeting
//   };

//   const newDate = setDateToDb(date);
//   const newStart = setTimeToDb(startTime);
//   const newEnd = setTimeToDb(endTime);

//   const workers = members
//     .map((idWorker) => {
//       return { idWorker };
//     })
//     .concat(
//       guests.map((idWorker) => {
//         return { idWorker, member: false };
//       })
//     );

//   const transaction = await sequelize.transaction();

//   try {
//     const dbMeetings = await Meeting.findAll({
//       where: { date: newDate },
//       transaction
//     });

//     if (dbMeetings) {
//       // FIXME revisar x k no esta pinchando esto
//       const conflict = checkConflict(newMeeting, dbMeetings);

//       switch (conflict) {
//         case 'session':
//           return res.status(400).json({
//             ok: false,
//             msg: 'Ya existe una Reunión de este Tipo que coincide en la sesión Ordinaria el mismo día.'
//           });
//         case 'type':
//           return res.status(400).json({
//             ok: false,
//             msg: 'Ya existe una Reunión de este Tipo que coincide con esta en el horario.'
//           });
//         case 'secretary':
//           return res.status(400).json({
//             ok: false,
//             msg: 'El secretario de acta debe asistir a otra reunión en este horario.'
//           });
//         case 'meeting':
//           return res.status(400).json({
//             ok: false,
//             msg: 'Ya existe una Reunión que coincide con esta en nombre, sesión, Tipo y fecha.'
//           });
//         default:
//           break;
//       }
//     }

//     const dbMeeting = await Meeting.create(
//       {
//         name,
//         session,
//         date: newDate,
//         startTime: newStart,
//         endTime: newEnd,
//         idTypeOfMeeting,
//         idSecretary
//       },
//       { transaction }
//     );

//     await MeetingWorker.bulkCreate(
//       workers.map((worker) => {
//         return {
//           idMeeting: dbMeeting.id,
//           idWorker: worker.idWorker,
//           member: worker.member
//         };
//       }),
//       { transaction }
//     );

//     await MeetingTopic.bulkCreate(
//       topics.map((mt) => {
//         return {
//           idMeeting: dbMeeting.id,
//           idTopic: mt.id
//         };
//       }),
//       { transaction }
//     );

//     await transaction.commit();

//     return res.status(201).json({
//       ok: true,
//       msg: 'Reunión creada'
//     });
//   } catch (err) {
//     console.error(err);

//     await transaction.rollback();

//     return res.status(500).json({
//       ok: false,
//       msg: 'Error al crear la Reunión'
//     });
//   }
// };

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

export const setOpen = async (req = request, res = response) => {
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

export const setClose = async (req = request, res = response) => {
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

export const getOrganization = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbMeeting = await Meeting.findByPk(id, { include: TypeOfMeeting });
    const dbOrganization = await Organization.findByPk(
      dbMeeting.typesOfMeeting.idOrganization
    );

    return res.json({
      ok: true,
      arg: dbOrganization
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener la Organización'
    });
  }
};
