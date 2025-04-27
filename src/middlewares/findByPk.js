import { request, response } from 'express';

import { idUserRegExp } from '../helpers/utils.js';
import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';

export const findByPk = async (req = request, res = response, next) => {
  const model = req.baseUrl.split('/')[2];
  const models = ['organizations'];
  let id = null;
  let found = null;
  let message = '';
  let word = '';

  if (models.includes(model)) {
    id = req.params.id;
  }

  try {
    switch (model) {
      case 'organizations':
        found = await Organization.findByPk(id);
        message = 'Organización no encontrada.';
        word = 'Organización';
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
