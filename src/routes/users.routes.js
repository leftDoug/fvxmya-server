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
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

router.get('/workers', getAllWorkers);
router.get('/:id', findByPk, getById);
router.get('/', getAll);
router.post('/', create);
router.patch('/unlock/:id', findByPk, unlock);
router.patch('/lock/:id', findByPk, lock);
router.patch('/:id', findByPk, update);

export default router;
