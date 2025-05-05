import { Router } from 'express';

import {
  create,
  getAll,
  getAllFrom,
  getById,
  getFromTomAndYear,
  remove,
  update
} from '../controllers/agenda.controller.js';
import { authenticateToken, isLeader } from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken, isLeader);
router.get('/type-meeting/:id', findByPk, getAllFrom);
router.get('/type-meeting-and-year/:id', findByPk, getFromTomAndYear);
router.get('/:id', findByPk, getById);
router.post('/', create);
router.patch('/:id', findByPk, update);
router.delete('/:id', findByPk, remove);

export default router;
