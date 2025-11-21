import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config';
import logger from './utils/logger';
import database from './config/database';
import redis from './config/redis';
import schedulerService from './services/schedulerService';

// Routes
import authRoutes from './routes/authRoutes';
import gmbRoutes from './routes/gmbRoutes';
import aiRoutes from './routes/aiRoutes';
import paymentRoutes from './routes/paymentRoutes';

// Middleware
import { generalLimiter } from './middleware/rateLimiter';

const app = express();

// Middleware
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gmb', gmbRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await database.query('SELECT NOW()');
    logger.info('Database connected successfully');

    // Test Redis connection
    await redis.set('health_check', 'ok', 60);
    logger.info('Redis connected successfully');

    // Initialize scheduler
    schedulerService.initialize();

    // Start listening
    app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`);
      logger.info(`Environment: ${config.server.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  schedulerService.stop();
  await database.close();
  await redis.close();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  schedulerService.stop();
  await database.close();
  await redis.close();
  
  process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

export default app;
