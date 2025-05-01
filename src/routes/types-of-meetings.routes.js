import { Router } from 'express';

import {
  create,
  getAll,
  getAllFrom,
  getById,
  remove,
  update
} from '../controllers/type-of-meeting.controller.js';
import { authenticateToken, isLeader } from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken, isLeader);
router.get('/organization/:id', findByPk, getAllFrom);
router.get('/:id', findByPk, getById);
router.post('/', create);
router.patch('/:id', findByPk, update);
router.delete('/:id', findByPk, remove);

export default router;
