import { Router } from 'express';

import {
  create,
  getAll,
  getAllFromLeader,
  getById,
  remove,
  update
} from '../controllers/organization.controller.js';
import {
  authenticateToken,
  isAdmin,
  isAdminOrLeader,
  isLeader
} from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken);
router.get('/leader', isLeader, getAllFromLeader);
router.get('/:id', findByPk, isAdminOrLeader, getById);
router.post('/', isAdmin, create);
router.patch('/:id', isAdminOrLeader, findByPk, update);
router.delete('/:id', isAdminOrLeader, findByPk, remove);

export default router;
