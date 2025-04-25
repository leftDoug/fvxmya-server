import { Router } from 'express';

import {
  getAll,
  getById,
  create,
  update,
  getTopics,
  erase,
  remove,
  getInfo,
  getTopicsFrom
} from '../controllers/agenda.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/info/:id', getInfo);
router.get('/:id/topics', getTopics);
router.get('/topics/:id', getTopicsFrom);
router.post('/', create);
router.patch('/:id', update);
router.patch('/:id/remove', remove);
router.delete('/:id', erase);

export default router;
