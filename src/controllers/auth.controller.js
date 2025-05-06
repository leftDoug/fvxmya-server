import bcrypt from 'bcryptjs';
import { request, response } from 'express';

import { sequelize } from '../db/config.js';
import { generateTokens, revokeToken, verifyToken } from '../helpers/jwt.js';

import picocolors from 'picocolors';
import { Token } from '../models/Token.js';
import { User } from '../models/User.js';

export const login = async (req = request, res = response) => {
  const { username, password } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbUser = await User.findOne({ where: { username }, transaction });

    if (!dbUser) {
      await transaction.commit();

      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas'
      });
    }

    if (!dbUser.state) {
      await transaction.commit();

      return res.status(401).json({
        ok: false,
        message:
          'Este usuario tiene el acceso bloqueado. Consulte al administrador del sistema'
      });
    }

    const pwdIsValid = await bcrypt.compare(password, dbUser.password);

    if (!pwdIsValid) {
      await transaction.commit();

      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas'
      });
    }

    const { authToken, refreshToken } = generateTokens(
      dbUser.id,
      dbUser.username,
      dbUser.role
    );

    const dbToken = await Token.findOne({
      where: { idUser: dbUser.id },
      include: User,
      transaction
    });

    if (dbToken) {
      await dbToken.update({ refreshToken }, { transaction });
    } else {
      await Token.create({ idUser: dbUser.id, refreshToken }, { transaction });
    }

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Usuario autenticado',
      authToken,
      refreshToken
    });
  } catch (err) {
    console.error(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesión'
    });
  }
};

// TODO falta testear esta funcion
export const refreshToken = async (req = request, res = response) => {
  const { refreshToken } = req.body;
  const transaction = await sequelize.transaction();

  try {
    if (!refreshToken) {
      await transaction.commit();

      return res.status(401).json({
        ok: false,
        message: 'Refresh token no recibido'
      });
    }

    const tokenValid = verifyToken(refreshToken);

    if (tokenValid.ok === false) {
      await transaction.commit();

      return res.status(401).json({
        ok: false,
        message: tokenValid.message.includes('expirado')
          ? 'Refresh token expirado'
          : tokenValid.message
        // expired: tokenValid.message.includes('expirado')
      });
    }

    const dbToken = await Token.findOne({
      where: { refreshToken },
      include: User,
      transaction
    });

    console.log('ENTRA:', picocolors.blueBright(refreshToken));
    console.log('ENCUENTRA:', picocolors.bgBlueBright(JSON.stringify(dbToken)));

    // console.log(picocolors.bgCyan(JSON.stringify(dbToken)));

    if (!dbToken) {
      await transaction.commit();

      return res.status(401).json({
        ok: false,
        message: 'Refresh token inválido (no enviado)'
      });
    }

    // await dbToken.destroy({ transaction });

    // const dbUser = await User.findByPk(dbToken.idUser, { transaction });

    // console.log(picocolors.bgGreen(JSON.stringify(dbUser)));

    const tokens = generateTokens(
      dbToken.user.id,
      dbToken.user.username,
      dbToken.user.role
    );

    console.log('SALE:', picocolors.blueBright(tokens.refreshToken));

    await dbToken.update(
      { refreshToken: tokens.refreshToken },
      { transaction }
    );

    // await Token.create(
    //   { idUser: dbToken.user.id, refreshToken: tokens.refreshToken },
    //   { transaction }
    // );

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Refresh token actualizado',
      authToken: tokens.authToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    console.error(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar token'
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

export const changePassword = async (req = request, res = response) => {
  const idUser = req.user.id;
  const { currentPassword, newPassword } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dbUser = await User.findByPk(idUser, { transaction });
    const pwdIsValid = await bcrypt.compare(currentPassword, dbUser.password);

    if (!pwdIsValid) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña es incorrecta'
      });
    }

    const salt = await bcrypt.genSalt();
    const newHashedPwd = await bcrypt.hash(newPassword, salt);

    await dbUser.update(
      {
        password: newHashedPwd
      },
      { transaction }
    );
    // await Token.destroy({ where: { idUser: dbUser.id }, transaction });

    const { authToken, refreshToken } = generateTokens(
      dbUser.id,
      dbUser.username,
      dbUser.role
    );

    console.log('NUEVA:', picocolors.yellow(refreshToken));

    await Token.update({ refreshToken }, { where: { idUser }, transaction });

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'Contraseña actualizada',
      authToken,
      refreshToken
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

export const logout = async (req = request, res = response) => {
  const authHeader = req.headers['authorization'];
  let token = undefined;
  const { refreshToken } = req.body;
  const transaction = await sequelize.transaction();

  if (authHeader && authHeader.includes('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log(picocolors.magenta(token));
    revokeToken(token);
  }

  try {
    if (refreshToken) {
      await Token.destroy({ where: { refreshToken }, transaction });
    }

    await transaction.commit();

    return res.json({
      ok: true,
      message: 'La sesión ha sido sesión cerrada'
    });
  } catch (err) {
    console.log(err);

    await transaction.rollback();

    return res.status(500).json({
      ok: false,
      message: 'Error al cerrar la sesión'
    });
  }
};
