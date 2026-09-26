import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  updateMeSchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', authLimiter, validate(refreshTokenSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);

router.get('/me', authenticate, AuthController.me);
router.patch('/me', authenticate, validate(updateMeSchema), AuthController.updateMe);

export default router;
