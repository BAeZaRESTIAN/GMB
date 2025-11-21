import { Request, Response } from 'express';
import { body } from 'express-validator';
import authService from '../services/authService';
import logger from '../utils/logger';

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('tenantName').optional().trim(),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await authService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        tenantId: user.tenant_id,
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { newPassword } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await authService.updatePassword(userId, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      logger.error('Update password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AuthController();
