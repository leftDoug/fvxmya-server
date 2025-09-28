import { Router } from 'express';

import {
  create,
  getAll,
  getAllWorkers,
  getById,
  lock,
  unlock,
  update
} from '../controllers/user.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

router.get('/workers', authenticateToken, getAllWorkers);
router.get('/:id', authenticateToken, isAdmin, findByPk, getById);
router.get('/', authenticateToken, isAdmin, getAll);
router.post('/', authenticateToken, isAdmin, create);
router.patch('/unlock/:id', authenticateToken, isAdmin, findByPk, unlock);
router.patch('/lock/:id', authenticateToken, isAdmin, findByPk, lock);
router.patch('/:id', findByPk, authenticateToken, isAdmin, update);

export default router;
