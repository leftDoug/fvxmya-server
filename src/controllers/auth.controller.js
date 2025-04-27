import bcrypt from 'bcryptjs';
import { request, response } from 'express';
import { QueryTypes } from 'sequelize';

import { sequelize } from '../db/config.js';
import { generateJWT, getIdUser } from '../helpers/jwt.js';

import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';

// FIXME arreglar los mensajes de error para usuario o contrasena incorrecta
export const login = async (req = request, res = response) => {
  const { username, password } = req.body;

  try {
    const dbUser = await User.findOne({ where: { username } });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario incorrecto'
      });
    }

    if (!dbUser.state) {
      return res.status(403).json({
        ok: false,
        message:
          'Este usuario tiene el acceso bloqueado. Consulte al administrador del sistema'
      });
    }

    const passwdIsValid = bcrypt.compareSync(password, dbUser.password);

    if (!passwdIsValid) {
      return res.status(400).json({
        ok: false,
        message: 'Contraseña incorrecta'
      });
    }

    const token = await generateJWT(dbUser.id, dbUser.role);

    // XXX ver como se puede mandar el token a la cache
    return res.json({
      ok: true,
      message: 'Ususrio autenticado',
      // id: dbUser.id,
      // username,
      token: token
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesión'
    });
  }
};

export const register = async (req = request, res = response, next) => {
  const { name, occupation, area, username, password, role } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let dbUser = await User.findOne({ where: { username }, transaction });

    if (dbUser) {
      return res.status(400).json({
        ok: false,
        message: 'Este nombre de usuario ya está en uso'
      });
    }

    const dbUsers = await User.findAll({ where: { name }, transaction });
    const userExists = dbUsers.some(
      (user) => user.occupation === occupation && user.area === area
    );

    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'Este trabajador ya tiene un Usuario creado'
      });
    }

    const coincidence = dbUsers.some((user) => user.area === area);

    if (coincidence) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un trabajador con este nombre en esta Área'
      });
    }

    // hash password
    const salt = bcrypt.genSaltSync();
    const pwd = bcrypt.hashSync(password, salt);
    // XXX ver si es mejor lo de hashear la pwd en el modelo directamente
    const user = await User.create(
      {
        name,
        username,
        password: pwd,
        occupation,
        area,
        role
      },
      { transaction }
    );

    // XXX se quito el token de la  respuesta xk no va
    // const token = await generateJWT(user.id, username);

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado',
      data: user
      // token
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      next(err);
    }
    console.error(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al crear el Usuario'
    });
  }
};

// XXX falta testear esta funcion
export const tokenRenewal = async (req = request, res = response) => {
  const { id, username } = req;

  const token = await generateJWT(id, username);

  const dbUser = await User.findByPk(id);

  return res.json({
    ok: true,
    id,
    idWorker: dbUser.idWorker,
    token
  });
};

export const update = async (req = request, res = response, next) => {
  const { id } = req.params;
  const { name, occupation, area, role } = req.body;

  const transaction = await sequelize.transaction();

  try {
    let dbUser = await User.findByPk(id, { transaction });
    const dbUsers = await User.findAll({ where: { name }, transaction });
    const userExists = dbUsers.some(
      (user) =>
        user.id !== dbUser.id &&
        user.occupation === occupation &&
        user.area === area
    );

    if (userExists) {
      return res.status(400).json({
        ok: false,
        message: 'Este trabajador ya tiene un Usuario creado'
      });
    }

    const coincidence = dbUsers.some(
      (user) => user.id !== dbUser.id && user.area === area
    );

    if (coincidence) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un trabajador con este nombre en esta Área'
      });
    }

    await dbUser.update(
      {
        name,
        occupation,
        area,
        role
      },
      { transaction }
    );

    dbUser = await User.findByPk(id, { transaction });

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Usuario actualizado',
      data: dbUser
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      next(error);
    }
    console.error(error);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar el Usuario'
    });
  }
};

export const getUsers = async (req = request, res = response) => {
  try {
    const dbUsers = await User.findAll();

    return res.json({
      ok: true,
      data: dbUsers
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener los Usuarios'
    });
  }
};

// export const getUsers = async (req = request, res = response) => {
//   try {
//     const dbUsers = await User.findAll({ include: [Role, Area] });
//     const users = dbUsers.map((user) => {
//       return {
//         id: user.id,
//         name: user.name,
//         occupation: user.occupation,
//         email: user.email,
//         area: user.area.name,
//         role: user.role.role,
//         username: user.username,
//         state: user.state
//       };
//     });

//     res.json({
//       ok: true,
//       arg: users
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       ok: false,
//       msg: 'Error al obtener los Usuarios'
//     });
//   }
// };

export const getWorkers = async (req = request, res = response) => {
  try {
    const dbWorkers = await sequelize.query(`SELECT * FROM view_workers`, {
      type: QueryTypes.SELECT
    });

    return res.json({
      data: dbWorkers
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al obtener los Trabajadores.'
    });
  }
};

export const getById = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const dbUser = await User.findByPk(id);

    return res.json({
      ok: true,
      arg: dbUser
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener el Usuario.'
    });
  }
};

export const getInfo = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const result = await sequelize.query(
      `
      			SELECT fn_user_getinfo(:id, 'dbuser');
            FETCH ALL IN dbuser;
      			`,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT
      }
    );

    const dbUser = result[1];

    return res.json({
      ok: true,
      arg: dbUser
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener el Usuario.'
    });
  }
};

export const setLock = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await User.update({ state: false }, { where: { id }, transaction });
    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Usuario bloqueado'
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al bloquear el Usuario'
    });
  }
};

export const setUnlock = async (req = request, res = response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    await User.update({ state: true }, { where: { id }, transaction });
    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Usuario activado'
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al activar el Usuario'
    });
  }
};

export const isAdmin = async (req = request, res = response) => {
  const { authorization } = req.headers;
  const idUser = getIdUser(authorization);

  try {
    const dbUser = await User.findByPk(idUser, { include: Role });

    if (dbUser.role.role === 'Administrador') {
      return res.json({
        ok: true,
        status: true
      });
    } else {
      return res.json({
        ok: true,
        status: false
      });
    }
  } catch (error) {
    console.log(err);

    return res.status(500).json({
      ok: false,
      msg: 'Error al verificar el rol del usuario'
    });
  }
};

export const getOrganizationsFromUser = async (
  req = request,
  res = response
) => {
  const { id } = req.params;

  try {
    const dbOrganizations = await Organization.findAll({
      where: { idLeader: id }
    });

    return res.json({
      ok: true,
      arg: dbOrganizations
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: true,
      msg: 'Error al obtener las Organizaciones'
    });
  }
};

export const changePassword = async (req = request, res = response) => {
  const { id } = req.params;
  const { oldPwd, newPwd } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbUser = await User.findByPk(id, { transaction });
    const pwdIsValid = await bcrypt.compare(oldPwd, dbUser.password);

    if (!pwdIsValid) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña es incorrecta'
      });
    }

    const salt = await bcrypt.genSalt();
    const newHashedPwd = await bcrypt.hash(newPwd, salt);

    await dbUser.update({
      password: newHashedPwd
    });

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Usuario actualizado'
    });
  } catch (err) {
    console.log(err);
    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar la contraseña'
    });
  }
};
