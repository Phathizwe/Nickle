const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getPrice } = require('./utils/pricing');
const { getSubscription, updateSubscription } = require('./utils/subscription');
const {
  handlePaymentSucceeded,
  handlePaymentFailed,
  handlePaymentRefunded
} = require('./handlers/webhookHandlers');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Yoco Webhook Handler
 * Processes payment events from Yoco
 */
exports.yocoWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const event = req.body;
    console.log('Yoco webhook received:', event.type);

    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.payload);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload);
        break;
      
      case 'payment.refunded':
        await handlePaymentRefunded(event.payload);
        break;
      
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

/**
 * Create Yoco Checkout Session
 * Creates a checkout session for subscription purchase
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { plan, billingCycle } = data;

  // Validate input
  if (!['premium'].includes(plan)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid plan');
  }

  if (!['monthly', 'yearly'].includes(billingCycle)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid billing cycle');
  }

  try {
    // Get price from Firestore pricing config
    const amount = await getPrice(plan, billingCycle);

    // In production, call Yoco API here to create a real checkout session
    const checkoutUrl = `https://checkout.yoco.com/test?amount=${amount}&currency=ZAR&userId=${userId}&plan=${plan}&billingCycle=${billingCycle}`;

    return {
      checkoutUrl,
      amount,
      currency: 'ZAR'
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

/**
 * Get Subscription Status
 * Retrieves current subscription status for a user
 */
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const subscription = await getSubscription(userId);

    if (!subscription) {
      return {
        status: 'none',
        plan: 'free'
      };
    }

    return subscription;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get subscription');
  }
});

/**
 * Cancel Subscription
 * Marks subscription for cancellation at period end
 */
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    await updateSubscription(userId, {
      cancelAtPeriodEnd: true
    });

    return { success: true };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to cancel subscription');
  }
});

/**
 * Reactivate Subscription
 * Removes cancellation flag from subscription
 */
exports.reactivateSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    await updateSubscription(userId, {
      cancelAtPeriodEnd: false
    });

    return { success: true };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to reactivate subscription');
  }
});
