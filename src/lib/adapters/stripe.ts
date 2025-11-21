export class StripeAdapter {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async createSubscription(priceId: string, customerId: string): Promise<any> {
    return { id: 'sub_demo', status: 'active' };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    console.log('Subscription canceled:', subscriptionId);
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    return true;
  }
}

export function createStripeAdapter(secretKey?: string): StripeAdapter {
  return new StripeAdapter(secretKey || 'demo-key');
}
