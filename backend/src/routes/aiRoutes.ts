import { Router } from 'express';
import { authenticate, tenantIsolation } from '../middleware/auth';
import aiService from '../services/aiService';
import logger from '../utils/logger';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

// Generate post content
router.post('/generate-post', async (req, res) => {
  try {
    const content = await aiService.generatePostContent(req.body);
    res.json({ content });
  } catch (error) {
    logger.error('Generate post error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Generate business description
router.post('/generate-description', async (req, res) => {
  try {
    const description = await aiService.generateBusinessDescription(req.body);
    res.json({ description });
  } catch (error) {
    logger.error('Generate description error:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

// Generate review response
router.post('/generate-review-response', async (req, res) => {
  try {
    const { reviewText, rating } = req.body;
    const response = await aiService.generateReviewResponse(reviewText, rating);
    res.json({ response });
  } catch (error) {
    logger.error('Generate review response error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Generate blog post
router.post('/generate-blog-post', async (req, res) => {
  try {
    const blogPost = await aiService.generateBlogPost(req.body);
    res.json(blogPost);
  } catch (error) {
    logger.error('Generate blog post error:', error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
});

// Analyze SEO
router.post('/analyze-seo', async (req, res) => {
  try {
    const { content, keywords } = req.body;
    const analysis = await aiService.analyzeSEO(content, keywords);
    res.json(analysis);
  } catch (error) {
    logger.error('Analyze SEO error:', error);
    res.status(500).json({ error: 'Failed to analyze SEO' });
  }
});

export default router;
