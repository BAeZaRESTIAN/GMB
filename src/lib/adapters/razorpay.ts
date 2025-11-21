export class RazorpayAdapter {
  private keyId: string;
  private keySecret: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  async createSubscription(planId: string, customerId: string): Promise<any> {
    return { id: 'sub_demo', status: 'active' };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    console.log('Subscription canceled:', subscriptionId);
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    return true;
  }
}

export function createRazorpayAdapter(keyId?: string, keySecret?: string): RazorpayAdapter {
  return new RazorpayAdapter(keyId || 'demo-key', keySecret || 'demo-secret');
}
