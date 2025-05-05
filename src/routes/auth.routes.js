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
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);
router.post('/change-password', authenticateToken, changePassword);

export default router;
