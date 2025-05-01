import { Router } from 'express';

import {
  close,
  create,
  getAll,
  getAllFrom,
  getById,
  open,
  setAttendance,
  update
} from '../controllers/meeting.controller.js';
import { authenticateToken, isLeader } from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken, isLeader);
router.get('/type-meeting/:id', findByPk, getAllFrom);
router.get('/:id', findByPk, getById);
router.post('/', create);
router.patch('/attendance/:id', findByPk, setAttendance);
router.patch('/open/:id', findByPk, open);
router.patch('/close/:id', findByPk, close);
router.patch('/:id', findByPk, update);

export default router;
