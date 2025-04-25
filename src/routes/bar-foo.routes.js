import { Router } from 'express';
import {
  createBar,
  createFoo,
  createFooSolo,
  getBarsSolos,
  getFoos,
  getFoosSolos
} from '../controllers/bar-foo.controller.js';

export const router = Router();

router.post('/bar', createBar);
router.post('/foo', createFoo);
router.post('/foosolo', createFooSolo);
router.get('/bar/:id', getFoos);
router.get('/foossolos/:id', getFoosSolos);
router.get('/barssolos/:id', getBarsSolos);

export default router;
