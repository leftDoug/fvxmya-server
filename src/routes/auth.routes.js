import { Router } from 'express';

import {
  changePassword,
  login,
  logout,
  refreshToken
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// router.use(authenticateToken);

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/change-password', authenticateToken, changePassword);

export default router;
