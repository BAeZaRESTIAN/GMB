import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import database from '../config/database';
import logger from '../utils/logger';

export class QRCodeService {
  async generateReviewQRCode(locationId: string, tenantId: string, reviewUrl: string) {
    try {
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(reviewUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Store in database
      const result = await database.query(
        `INSERT INTO qr_codes (tenant_id, location_id, qr_code_url, review_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [tenantId, locationId, qrCodeDataUrl, reviewUrl]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('QR code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  async getQRCodesByLocation(locationId: string) {
    try {
      const result = await database.query(
        'SELECT * FROM qr_codes WHERE location_id = $1 ORDER BY created_at DESC',
        [locationId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Get QR codes error:', error);
      throw error;
    }
  }

  async incrementScan(qrCodeId: string) {
    try {
      await database.query(
        'UPDATE qr_codes SET scans = scans + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [qrCodeId]
      );
    } catch (error) {
      logger.error('Increment QR scan error:', error);
      throw error;
    }
  }
}

export default new QRCodeService();
