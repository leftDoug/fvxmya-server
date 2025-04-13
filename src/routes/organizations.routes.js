import { Router } from 'express';

import {
  getAll,
  getById,
  getWorkers,
  create,
  update,
  remove,
  getInfo,
  getAllFrom
  // getToms
} from '../controllers/organization.controller.js';
import { findByPk } from '../middlewares/findByPk.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', findByPk, getById);
router.get('/info/:id', findByPk, getInfo);
// router.get('/types-of-meetings/:id', findByPk, getToms);
router.get('/workers/:id', findByPk, getWorkers);
router.get('/worker/:id', getAllFrom);
router.post('/', create);
router.patch('/:id', findByPk, update);
router.delete('/remove/:id', findByPk, remove);

export default router;
