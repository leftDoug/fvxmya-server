import { Router } from 'express';

import { validateJWT } from '../middlewares/validate-jwt.js';

import {
  changePassword,
  getById,
  getInfo,
  getOrganizationsFromUser,
  getUsers,
  getWorkers,
  isAdmin,
  login,
  register,
  setLock,
  setUnlock,
  tokenRenewal,
  update
} from '../controllers/auth.controller.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// register user
router.post('/register', register);

// login
router.post('/login', login);

// renew token
router.get('/renew', validateJWT, tokenRenewal);

router.get('/users', getUsers);
router.get('/isadmin', isAdmin);
router.get('/users/organizations/:id', getOrganizationsFromUser);

router.get('/users/:id', getById);

router.get('/users/info/:id', findByPk, getInfo);

router.get('/workers', getWorkers);

router.patch('/users/:id', update);
router.patch('/users/lock/:id', setLock);
router.patch('/users/unlock/:id', setUnlock);
router.patch('/change-password/:id', changePassword);

export default router;
