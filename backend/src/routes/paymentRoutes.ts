import { Router } from 'express';
import { authenticate, tenantIsolation } from '../middleware/auth';
import paymentService from '../services/paymentService';
import logger from '../utils/logger';

const router = Router();

router.use(authenticate);
router.use(tenantIsolation);

// Create Razorpay order
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const order = await paymentService.createRazorpayOrder({
      ...req.body,
      tenantId,
      gateway: 'razorpay',
    });
    res.json(order);
  } catch (error) {
    logger.error('Create Razorpay order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const isValid = await paymentService.verifyRazorpayPayment(orderId, paymentId, signature);
    
    if (isValid) {
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    logger.error('Verify Razorpay payment error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Create Stripe payment intent
router.post('/stripe/create-payment-intent', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const paymentIntent = await paymentService.createStripePaymentIntent({
      ...req.body,
      tenantId,
      gateway: 'stripe',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error('Create Stripe payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Create PayPal order
router.post('/paypal/create-order', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const order = await paymentService.createPayPalOrder({
      ...req.body,
      tenantId,
      gateway: 'paypal',
    });
    res.json(order);
  } catch (error) {
    logger.error('Create PayPal order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const tenantId = (req as any).user.tenantId;
    const transactions = await paymentService.getTransactionsByTenant(tenantId);
    res.json({ transactions });
  } catch (error) {
    logger.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Stripe webhook
router.post('/webhooks/stripe', async (req, res) => {
  try {
    await paymentService.handleStripeWebhook(req.body);
    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Razorpay webhook
router.post('/webhooks/razorpay', async (req, res) => {
  try {
    await paymentService.handleRazorpayWebhook(req.body);
    res.json({ received: true });
  } catch (error) {
    logger.error('Razorpay webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
