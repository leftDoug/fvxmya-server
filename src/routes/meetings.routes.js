import { Router } from 'express';

import {
  getAll,
  getAgreements,
  getById,
  create,
  update,
  getInfo,
  // getParticipants,
  // getOrganization,
  setAttendance,
  setOpen,
  setClose,
  getOrganization
} from '../controllers/meeting.controller.js';

const router = Router();

router.get('/', getAll);
router.post('/', create);
router.get('/agreements/:id', getAgreements);
// router.get('/:id/participants', getParticipants);
// router.get('/:id/organization', getOrganization);
router.get('/:id', getById);
router.get('/organization/:id', getOrganization);
router.get('/info/:id', getInfo);
router.patch('/:id', update);
router.patch('/attendance/:id', setAttendance);
router.patch('/open/:id', setOpen);
router.patch('/close/:id', setClose);

export default router;
