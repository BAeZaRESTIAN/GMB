import { Router } from 'express';
import authController, { registerValidation, loginValidation } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validator';

const router = Router();

router.post('/register', authLimiter, validate(registerValidation), authController.register.bind(authController));
router.post('/login', authLimiter, validate(loginValidation), authController.login.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.put('/password', authenticate, authController.updatePassword.bind(authController));

export default router;
