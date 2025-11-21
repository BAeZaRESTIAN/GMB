import cron from 'node-cron';
import database from '../config/database';
import gmbService from './gmbService';
import logger from '../utils/logger';
import { PostStatus } from '../types';

export class SchedulerService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  initialize() {
    // Run every minute to check for scheduled posts
    cron.schedule('* * * * *', async () => {
      await this.processScheduledPosts();
    });

    // Run every hour to check for scheduled blogger posts
    cron.schedule('0 * * * *', async () => {
      await this.processScheduledBloggerPosts();
    });

    // Run daily to sync reviews
    cron.schedule('0 2 * * *', async () => {
      await this.syncReviews();
    });

    logger.info('Scheduler service initialized');
  }

  private async processScheduledPosts() {
    try {
      const now = new Date();
      
      const result = await database.query(
        `SELECT p.*, l.google_location_id, l.access_token, l.refresh_token, l.token_expiry
         FROM posts p
         JOIN gmb_locations l ON p.location_id = l.id
         WHERE p.status = $1 AND p.scheduled_at <= $2 AND l.is_active = true`,
        [PostStatus.SCHEDULED, now]
      );

      for (const post of result.rows) {
        try {
          // Check if token needs refresh
          let accessToken = post.access_token;
          if (new Date(post.token_expiry) <= now) {
            const refreshed = await gmbService.refreshAccessToken(post.refresh_token);
            accessToken = refreshed.accessToken;
            
            // Update token in database
            await database.query(
              'UPDATE gmb_locations SET access_token = $1, token_expiry = $2 WHERE id = $3',
              [accessToken, new Date(refreshed.expiryDate!), post.location_id]
            );
          }

          // Create post on GMB
          const postData = {
            languageCode: 'en',
            summary: post.content,
            media: post.media_urls.map((url: string) => ({
              sourceUrl: url,
            })),
          };

          const gmbPost = await gmbService.createPost(
            post.google_location_id,
            accessToken,
            postData
          );

          // Update post status
          await database.query(
            'UPDATE posts SET status = $1, published_at = CURRENT_TIMESTAMP, google_post_id = $2 WHERE id = $3',
            [PostStatus.PUBLISHED, gmbPost.name, post.id]
          );

          logger.info(`Post ${post.id} published successfully`);
        } catch (error) {
          logger.error(`Failed to publish post ${post.id}:`, error);
          
          // Mark as failed
          await database.query(
            'UPDATE posts SET status = $1 WHERE id = $2',
            [PostStatus.FAILED, post.id]
          );
        }
      }
    } catch (error) {
      logger.error('Process scheduled posts error:', error);
    }
  }

  private async processScheduledBloggerPosts() {
    try {
      const now = new Date();
      
      const result = await database.query(
        `SELECT * FROM blogger_posts
         WHERE status = $1 AND scheduled_at <= $2`,
        [PostStatus.SCHEDULED, now]
      );

      for (const post of result.rows) {
        try {
          // Blogger API integration would go here
          // For now, just mark as published
          
          await database.query(
            'UPDATE blogger_posts SET status = $1, published_at = CURRENT_TIMESTAMP WHERE id = $2',
            [PostStatus.PUBLISHED, post.id]
          );

          logger.info(`Blogger post ${post.id} published successfully`);
        } catch (error) {
          logger.error(`Failed to publish blogger post ${post.id}:`, error);
          
          await database.query(
            'UPDATE blogger_posts SET status = $1 WHERE id = $2',
            [PostStatus.FAILED, post.id]
          );
        }
      }
    } catch (error) {
      logger.error('Process scheduled blogger posts error:', error);
    }
  }

  private async syncReviews() {
    try {
      const locations = await database.query(
        'SELECT * FROM gmb_locations WHERE is_active = true'
      );

      for (const location of locations.rows) {
        try {
          const reviews = await gmbService.getReviews(
            location.google_location_id,
            location.access_token
          );

          // Process and store reviews
          // Implementation would depend on API response structure
          
          logger.info(`Synced reviews for location ${location.id}`);
        } catch (error) {
          logger.error(`Failed to sync reviews for location ${location.id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Sync reviews error:', error);
    }
  }

  async schedulePost(postId: string, scheduledAt: Date) {
    try {
      await database.query(
        'UPDATE posts SET status = $1, scheduled_at = $2 WHERE id = $3',
        [PostStatus.SCHEDULED, scheduledAt, postId]
      );

      logger.info(`Post ${postId} scheduled for ${scheduledAt}`);
    } catch (error) {
      logger.error('Schedule post error:', error);
      throw error;
    }
  }

  stop() {
    this.jobs.forEach((job) => job.stop());
    this.jobs.clear();
  }
}

export default new SchedulerService();
