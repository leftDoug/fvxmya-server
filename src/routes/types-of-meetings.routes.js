import { Router } from 'express';

import {
  getById,
  getMeetings,
  create,
  update,
  remove,
  getInfo,
  getAgendas,
  getAll,
  getAllFrom
} from '../controllers/type-of-meeting.controller.js';

const router = Router();

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.get('/info/:id', getInfo);
router.get('/organization/:id', getAllFrom);
router.get('/meetings/:id', getMeetings);
router.get('/agendas/:id', getAgendas);
router.patch('/:id', update);
router.patch('/remove/:id', remove);

export default router;
