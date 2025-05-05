import { request, response } from 'express';

import { validate } from 'uuid';
import { idUserRegExp } from '../helpers/utils.js';
import { Agenda } from '../models/Agenda.js';
import { Agreement } from '../models/Agreement.js';
import { Meeting } from '../models/Meeting.js';
import { Organization } from '../models/Organization.js';
import { TypeOfMeeting } from '../models/TypeOfMeeting.js';
import { User } from '../models/User.js';

export const findByPk = async (req = request, res = response, next) => {
  const model = req.baseUrl.split('/')[2];
  let model2 = '';
  let id = null;
  let found = null;
  let message = '';
  let word = '';

  try {
    switch (model) {
      case 'organizations':
        model2 = req.url.split('/')[1];
        id = req.params.id;

        if (model2 === 'leader') {
          found = await Organization.findAll({ where: { idLeader: id } });
        } else if (!isNaN(id)) {
          found = await Organization.findByPk(parseInt(id));
        }

        message = 'Organización no encontrada';
        word = 'Organización';

        break;
      case 'types-meetings':
        model2 = req.url.split('/')[1];
        id = req.params.id;

        if (!isNaN(id)) {
          if (model2 === 'organization') {
            found = await TypeOfMeeting.findAll({
              where: { idOrganization: parseInt(id) }
            });
          } else {
            found = await TypeOfMeeting.findByPk(parseInt(id));
          }
        }

        message = 'Tipo de Reunión no encontrado';
        word = 'Tipo de Reunion';

        break;
      case 'meetings':
        model2 = req.url.split('/')[1];
        id = req.params.id;

        if (!isNaN(id)) {
          if (model2 === 'type-meeting') {
            found = await Meeting.findAll({
              where: { idTypeOfMeeting: parseInt(id) }
            });
          } else {
            found = await Meeting.findByPk(parseInt(id));
          }
        }

        message = 'Reunión no encontrada';
        word = 'Reunion';

        break;
      case 'agendas':
        model2 = req.url.split('/')[1];
        id = req.params.id;

        if (!isNaN(id)) {
          if (model2 === 'type-meeting') {
            found = await Agenda.findAll({
              where: { idTypeOfMeeting: parseInt(id) }
            });
          } else if (model2 === 'type-meeting-and-year') {
            const { year } = req.params;
            found = await Agenda.findAll({
              where: { idTypeOfMeeting: parseInt(id), year }
            });
          } else {
            found = await Agenda.findByPk(parseInt(id));
          }
        }

        message = 'Agenda no encontrada';
        word = 'Agenda';

        break;
      case 'users':
        id = req.params.id;

        if (validate(id)) {
          found = await User.findByPk(id);
        }

        message = 'Usuario no encontrado';
        word = 'Usuario';

        break;
      case 'agreements':
        model2 = req.url.split('/')[1];
        id = req.params.id;

        if (model2 === 'meeting' && !isNaN(id)) {
          found = await Agreement.findAll({
            where: { idMeeting: parseInt(id) }
          });
        }
        // else if (model2 === 'responsible' && validate(id)) {
        //   found = await Agreement.findAll({
        //     where: { idResponsible: id }
        //   });
        // }
        else {
          found = await Agreement.findByPk(id);
        }

        message = 'Acuerdo no encontrado';
        word = 'Acuerdo';

        break;
      case 'auth':
        if (req.path.includes('register') || req.method === 'PATCH') {
          const { idRole } = req.body;
          found = await Role.findByPk(idRole);

          if (!found) {
            message = 'Rol no encontrado.';
            word = 'Rol';
          }
        } else {
          // FIXME mirar si arreglar el mensaje de error
          if (req.path.includes('users')) {
            id = req.params.id;

            if (id.match(idUserRegExp)) {
              found = await User.findByPk(id);
              message = 'Usuario no encontrado.';
              word = 'Usuario';
            } else {
              message = 'Usuario no encontrado. ID de Usuario no válido.';
              word = 'Usuario';
            }
          }
        }
        break;
      default:
        break;
    }

    if (!found) {
      return res.status(404).json({
        ok: false,
        message
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      message: `Error al buscar ${word}.`
    });
  }

  next();
};
