import { Router } from 'express';

import {
  create,
  getAllFromMeeting,
  getAllFromUser,
  getById,
  getInfo,
  getResponses,
  setCompleted,
  update
} from '../controllers/agreement.controller.js';

const router = Router();

router.get('/', getAllFromUser);
router.get('/:id', getById);
router.get('/info/:id', getInfo);
router.get('/meeting/:id', getAllFromMeeting);
router.get('/responses/:id', getResponses);
router.post('/', create);
router.patch('/:id', update);
router.patch('/complete/:id', setCompleted);

export default router;
