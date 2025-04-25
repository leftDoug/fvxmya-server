import { Router } from 'express';

import {
  create,
  getAgreements,
  getAll,
  getAllFrom,
  getById,
  getInfo,
  getOrganization,
  // getParticipants,
  // getOrganization,
  setAttendance,
  setClose,
  setOpen,
  update
} from '../controllers/meeting.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/type-of-meeting/:id', getAllFrom);
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
