import { Router } from 'express';

import {
  close,
  create,
  getAll,
  getAllFromLeader,
  getAllFromTom,
  getById,
  open,
  remove,
  setAttendance,
  update
} from '../controllers/meeting.controller.js';
import { authenticateToken, isLeader } from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken, isLeader);
router.get('/type-meeting/:id', findByPk, getAllFromTom);
router.get('/leader', getAllFromLeader);
router.get('/:id', findByPk, getById);
router.post('/', create);
router.patch('/attendance/:id', findByPk, setAttendance);
router.patch('/open/:id', findByPk, open);
router.patch('/close/:id', findByPk, close);
router.patch('/:id', findByPk, update);
router.delete('/:id', findByPk, remove);

export default router;
