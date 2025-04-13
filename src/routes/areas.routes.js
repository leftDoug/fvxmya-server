import { Router } from 'express';

import {
  getAll,
  getById,
  getWorkers,
  create,
  update,
  remove
} from '../controllers/area.controller.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', findByPk, getById);
router.get('/workers/:id', findByPk, getWorkers);
router.post('/', create);
router.patch('/:id', findByPk, update);
router.delete('/:id', remove);

// router.patch('/remove/:id', findByPk, remove);

export default router;
