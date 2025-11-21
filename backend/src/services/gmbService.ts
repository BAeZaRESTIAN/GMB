import { google } from 'googleapis';
import config from '../config';
import logger from '../utils/logger';

export class GMBService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );
  }

  getAuthUrl(tenantId: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: tenantId,
    });
  }

  async handleCallback(code: string, _tenantId: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Store tokens for the location
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
      };
    } catch (error) {
      logger.error('GMB OAuth callback error:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      return {
        accessToken: credentials.access_token,
        expiryDate: credentials.expiry_date,
      };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  async listLocations(accessToken: string) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      // Google Business Profile API integration
      // Note: The actual API structure may vary based on the specific GMB API version
      logger.info('Listing GMB locations');
      
      // This is a placeholder - actual implementation would use the GMB API
      return {
        accounts: [],
      };
    } catch (error) {
      logger.error('List locations error:', error);
      throw new Error('Failed to fetch locations');
    }
  }

  async updateLocation(locationId: string, accessToken: string, updateData: any) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const mybusiness = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client,
      });

      const response = await mybusiness.locations.patch({
        name: locationId,
        updateMask: Object.keys(updateData).join(','),
        requestBody: updateData,
      });

      return response.data;
    } catch (error) {
      logger.error('Update location error:', error);
      throw new Error('Failed to update location');
    }
  }

  async createPost(locationId: string, accessToken: string, postData: any) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      // GMB posts would use a different API endpoint
      // This is a placeholder for the actual implementation
      logger.info(`Creating post for location ${locationId}`);
      
      return {
        name: `${locationId}/posts/${Date.now()}`,
        ...postData,
      };
    } catch (error) {
      logger.error('Create post error:', error);
      throw new Error('Failed to create post');
    }
  }

  async getReviews(locationId: string, accessToken: string) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      // GMB reviews API would be used here
      // This is a placeholder for the actual implementation
      logger.info(`Getting reviews for location ${locationId}`);
      
      return {
        reviews: [],
      };
    } catch (error) {
      logger.error('Get reviews error:', error);
      throw new Error('Failed to fetch reviews');
    }
  }

  async replyToReview(reviewName: string, accessToken: string, reply: string) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      // GMB review reply API would be used here
      // This is a placeholder for the actual implementation
      logger.info(`Replying to review ${reviewName}`);
      
      return {
        name: reviewName,
        comment: reply,
      };
    } catch (error) {
      logger.error('Reply to review error:', error);
      throw new Error('Failed to reply to review');
    }
  }
}

export default new GMBService();
