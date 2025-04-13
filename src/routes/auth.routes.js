import { Router } from 'express';

import { validateJWT } from '../middlewares/validate-jwt.js';

import {
  getWorkers,
  getById,
  getInfo,
  login,
  register,
  tokenRenewal,
  update,
  getUsers,
  setLock,
  setUnlock,
  isAdmin,
  getOrganizationsFromUser
} from '../controllers/auth.controller.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// register user
router.post('/register', findByPk, register);

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

export default router;
