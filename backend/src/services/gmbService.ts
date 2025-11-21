import { google } from 'googleapis';
import config from '../config';
import database from '../config/database';
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

  async handleCallback(code: string, tenantId: string) {
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
      const mybusiness = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client,
      });

      const response = await mybusiness.accounts.list();
      return response.data;
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
      const mybusiness = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client,
      });

      const response = await mybusiness.locations.localPosts.create({
        parent: locationId,
        requestBody: postData,
      });

      return response.data;
    } catch (error) {
      logger.error('Create post error:', error);
      throw new Error('Failed to create post');
    }
  }

  async getReviews(locationId: string, accessToken: string) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const mybusiness = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client,
      });

      const response = await mybusiness.accounts.locations.reviews.list({
        parent: locationId,
      });

      return response.data;
    } catch (error) {
      logger.error('Get reviews error:', error);
      throw new Error('Failed to fetch reviews');
    }
  }

  async replyToReview(reviewName: string, accessToken: string, reply: string) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const mybusiness = google.mybusinessbusinessinformation({
        version: 'v1',
        auth: this.oauth2Client,
      });

      const response = await mybusiness.accounts.locations.reviews.updateReply({
        name: reviewName,
        requestBody: {
          comment: reply,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Reply to review error:', error);
      throw new Error('Failed to reply to review');
    }
  }
}

export default new GMBService();
