import { Router } from 'express';

import { create, getAll } from '../controllers/response.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// TODO eliminar
router.get('/', getAll);
router.use(authenticateToken);
router.post('/', create);

export default router;
