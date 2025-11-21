export class GoogleGMBAdapter {
  private credentials: any;

  constructor(credentials: any) {
    this.credentials = credentials;
  }

  async listBusinesses(): Promise<any[]> {
    return [];
  }

  async getProfile(locationId: string): Promise<any> {
    return { locationId, name: 'Demo Business' };
  }

  async updateProfile(locationId: string, updates: any): Promise<void> {
    console.log('Profile updated:', locationId, updates);
  }

  async createPost(locationId: string, post: any): Promise<string> {
    return 'post-id-demo';
  }

  async getReviews(locationId: string): Promise<any[]> {
    return [];
  }

  async replyToReview(reviewId: string, reply: string): Promise<void> {
    console.log('Review reply sent:', reviewId, reply);
  }
}

export function createGoogleGMBAdapter(credentials?: any): GoogleGMBAdapter {
  return new GoogleGMBAdapter(credentials || {});
}
