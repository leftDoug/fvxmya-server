import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import picocolors from 'picocolors';
import { User } from '../models/User.js';

const SECRET_KEY = process.env.SECRET_JWT || 'p455w0rd';

export const authenticateToken = async (
  req = request,
  res = response,
  next
) => {
  const authHeader = req.headers['authorization'];
  let token = undefined;

  if (authHeader && authHeader.includes('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Token no recibido'
    });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // XXX no es necesario xk el verify da error
    // if (new Date() > new Date(decodedToken.exp * 1000)) {
    //   return res.status(401).json({
    //     ok: false,
    //     message: 'Token expirado',
    //     expired: true
    //   });
    // }

    const dbUser = await User.findByPk(decodedToken.id);

    if (!dbUser) {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    req.user = {
      id: dbUser.id,
      role: dbUser.role
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        message: 'Token expirado',
        expired: true
      });
    }

    return res.status(401).json({
      ok: false,
      message: 'Token inválido'
    });
  }
};

export const isAdmin = (req = request, res = response, next) => {
  if (req.user && req.user.role === 'ADMINISTRADOR') {
    next();
  } else {
    console.log(picocolors.magenta('NO ADMIN'));
    return res.status(403).json({
      ok: false,
      message: 'Se requiren permisos de administrador para esta acción'
    });
  }
};

export const isLeader = (req = request, res = response, next) => {
  if (req.user && req.user.role === 'LÍDER') {
    next();
  } else {
    return res.status(403).json({
      ok: false,
      message: 'Se requiren permisos de líder de organización para esta acción'
    });
  }
};
