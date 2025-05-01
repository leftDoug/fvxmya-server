import { Router } from 'express';

import {
  cancel,
  complete,
  create,
  getAll,
  getAllFrom,
  getAllFromUser,
  getById,
  update
} from '../controllers/agreement.controller.js';
import { authenticateToken, isLeader } from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken);
router.get('/meeting/:id', isLeader, findByPk, getAllFrom);
router.get('/responsible', getAllFromUser);
router.get('/:id', findByPk, getById);
router.post('/', create);
router.patch('/complete/:id', findByPk, complete);
router.patch('/cancel/:id', findByPk, cancel);
router.patch('/:id', findByPk, update);

export default router;
