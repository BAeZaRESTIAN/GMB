import { Router } from 'express';
import { authenticate, tenantIsolation } from '../middleware/auth';
import gmbService from '../services/gmbService';
import database from '../config/database';
import logger from '../utils/logger';

const router = Router();

// All GMB routes require authentication and tenant isolation
router.use(authenticate);
router.use(tenantIsolation);

// Get OAuth URL
router.get('/auth-url', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const authUrl = gmbService.getAuthUrl(tenantId);
    res.json({ authUrl });
  } catch (error) {
    logger.error('Get auth URL error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
  try {
    const { code, state: tenantId } = req.query;
    
    if (!code || !tenantId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const tokens = await gmbService.handleCallback(code as string, tenantId as string);
    
    // Store tokens would typically be done after fetching location info
    res.json({ message: 'Authentication successful', tokens });
  } catch (error) {
    logger.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// List locations
router.get('/locations', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    
    const result = await database.query(
      'SELECT * FROM gmb_locations WHERE tenant_id = $1 AND is_active = true',
      [tenantId]
    );
    
    res.json({ locations: result.rows });
  } catch (error) {
    logger.error('List locations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get location details
router.get('/locations/:id', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const { id } = req.params;
    
    const result = await database.query(
      'SELECT * FROM gmb_locations WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    
    res.json({ location: result.rows[0] });
  } catch (error) {
    logger.error('Get location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update location
router.put('/locations/:id', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const { id } = req.params;
    const updateData = req.body;
    
    const location = await database.query(
      'SELECT * FROM gmb_locations WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    
    if (location.rows.length === 0) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    
    // Update in GMB
    await gmbService.updateLocation(
      location.rows[0].google_location_id,
      location.rows[0].access_token,
      updateData
    );
    
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    logger.error('Update location error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
