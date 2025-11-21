export class PayPalAdapter {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async createSubscription(planId: string): Promise<any> {
    return { id: 'sub_demo', status: 'ACTIVE' };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    console.log('Subscription canceled:', subscriptionId);
  }

  async verifyWebhook(payload: any): Promise<boolean> {
    return true;
  }
}

export function createPayPalAdapter(clientId?: string, clientSecret?: string): PayPalAdapter {
  return new PayPalAdapter(clientId || 'demo-client', clientSecret || 'demo-secret');
}
