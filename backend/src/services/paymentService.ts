import Razorpay from 'razorpay';
import Stripe from 'stripe';
import config from '../config';
import database from '../config/database';
import logger from '../utils/logger';
import { PaymentStatus } from '../types';

// Razorpay client
const razorpayClient = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Stripe client
const stripeClient = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

export interface PaymentData {
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'stripe' | 'paypal';
}

export class PaymentService {
  // Razorpay methods
  async createRazorpayOrder(data: PaymentData) {
    try {
      const order = await razorpayClient.orders.create({
        amount: Math.round(data.amount * 100), // Convert to paise
        currency: data.currency,
        receipt: `receipt_${data.subscriptionId}`,
        notes: {
          tenantId: data.tenantId,
          subscriptionId: data.subscriptionId,
        },
      });

      // Create transaction record
      await this.createTransaction({
        ...data,
        gatewayTransactionId: order.id,
        status: PaymentStatus.PENDING,
      });

      return order;
    } catch (error) {
      logger.error('Razorpay order creation error:', error);
      throw new Error('Failed to create Razorpay order');
    }
  }

  async verifyRazorpayPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      logger.error('Razorpay verification error:', error);
      return false;
    }
  }

  // Stripe methods
  async createStripePaymentIntent(data: PaymentData) {
    try {
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency,
        metadata: {
          tenantId: data.tenantId,
          subscriptionId: data.subscriptionId,
        },
      });

      // Create transaction record
      await this.createTransaction({
        ...data,
        gatewayTransactionId: paymentIntent.id,
        status: PaymentStatus.PENDING,
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Stripe payment intent creation error:', error);
      throw new Error('Failed to create Stripe payment intent');
    }
  }

  async createStripeSubscription(customerId: string, priceId: string, tenantId: string) {
    try {
      const subscription = await stripeClient.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: {
          tenantId,
        },
      });

      return subscription;
    } catch (error) {
      logger.error('Stripe subscription creation error:', error);
      throw new Error('Failed to create Stripe subscription');
    }
  }

  async createStripeCustomer(email: string, tenantId: string) {
    try {
      const customer = await stripeClient.customers.create({
        email,
        metadata: {
          tenantId,
        },
      });

      return customer;
    } catch (error) {
      logger.error('Stripe customer creation error:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  // PayPal methods (basic implementation)
  async createPayPalOrder(data: PaymentData) {
    try {
      // PayPal SDK integration would go here
      // This is a placeholder implementation
      const orderId = `PAYPAL_${Date.now()}`;

      await this.createTransaction({
        ...data,
        gatewayTransactionId: orderId,
        status: PaymentStatus.PENDING,
      });

      return {
        orderId,
        approvalUrl: `https://www.${config.paypal.mode}.paypal.com/checkoutnow?token=${orderId}`,
      };
    } catch (error) {
      logger.error('PayPal order creation error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  // Common methods
  private async createTransaction(data: any) {
    try {
      const result = await database.query(
        `INSERT INTO payment_transactions 
         (tenant_id, subscription_id, payment_gateway, gateway_transaction_id, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          data.tenantId,
          data.subscriptionId,
          data.gateway,
          data.gatewayTransactionId,
          data.amount,
          data.currency,
          data.status,
        ]
      );

      return result.rows[0].id;
    } catch (error) {
      logger.error('Transaction creation error:', error);
      throw error;
    }
  }

  async updateTransactionStatus(gatewayTransactionId: string, status: PaymentStatus) {
    try {
      await database.query(
        'UPDATE payment_transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE gateway_transaction_id = $2',
        [status, gatewayTransactionId]
      );
    } catch (error) {
      logger.error('Transaction status update error:', error);
      throw error;
    }
  }

  async getTransactionsByTenant(tenantId: string) {
    try {
      const result = await database.query(
        'SELECT * FROM payment_transactions WHERE tenant_id = $1 ORDER BY created_at DESC',
        [tenantId]
      );
      return result.rows;
    } catch (error) {
      logger.error('Get transactions error:', error);
      throw error;
    }
  }

  // Webhook handlers
  async handleStripeWebhook(event: any) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.updateTransactionStatus(
            event.data.object.id,
            PaymentStatus.COMPLETED
          );
          break;
        case 'payment_intent.payment_failed':
          await this.updateTransactionStatus(
            event.data.object.id,
            PaymentStatus.FAILED
          );
          break;
        case 'customer.subscription.updated':
          // Handle subscription updates
          break;
        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          break;
      }
    } catch (error) {
      logger.error('Stripe webhook handler error:', error);
      throw error;
    }
  }

  async handleRazorpayWebhook(event: any) {
    try {
      switch (event.event) {
        case 'payment.captured':
          await this.updateTransactionStatus(
            event.payload.payment.entity.order_id,
            PaymentStatus.COMPLETED
          );
          break;
        case 'payment.failed':
          await this.updateTransactionStatus(
            event.payload.payment.entity.order_id,
            PaymentStatus.FAILED
          );
          break;
      }
    } catch (error) {
      logger.error('Razorpay webhook handler error:', error);
      throw error;
    }
  }
}

export default new PaymentService();
