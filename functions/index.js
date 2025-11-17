const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Yoco Webhook Handler
exports.yocoWebhook = functions.https.onRequest(async (req, res) => {
  // Only accept POST requests
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

// Handle successful payment
async function handlePaymentSucceeded(payment) {
  const userId = payment.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in payment metadata');
    return;
  }

  // Update subscription status
  const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc('current');
  
  await subscriptionRef.set({
    status: 'active',
    plan: payment.metadata.plan || 'pro',
    billingCycle: payment.metadata.billingCycle || 'monthly',
    currentPeriodStart: admin.firestore.FieldValue.serverTimestamp(),
    currentPeriodEnd: calculatePeriodEnd(payment.metadata.billingCycle),
    cancelAtPeriodEnd: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  // Record payment
  await db.collection('users').doc(userId).collection('payments').add({
    amount: payment.amount,
    currency: payment.currency,
    status: 'succeeded',
    yocoPaymentId: payment.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: payment.metadata
  });

  console.log(`Payment succeeded for user ${userId}`);
}

// Handle failed payment
async function handlePaymentFailed(payment) {
  const userId = payment.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in payment metadata');
    return;
  }

  // Update subscription status to past_due
  const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc('current');
  
  await subscriptionRef.update({
    status: 'past_due',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Record failed payment
  await db.collection('users').doc(userId).collection('payments').add({
    amount: payment.amount,
    currency: payment.currency,
    status: 'failed',
    yocoPaymentId: payment.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: payment.metadata,
    failureReason: payment.failureReason
  });

  console.log(`Payment failed for user ${userId}`);
}

// Handle refunded payment
async function handlePaymentRefunded(payment) {
  const userId = payment.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in payment metadata');
    return;
  }

  // Record refund
  await db.collection('users').doc(userId).collection('payments').add({
    amount: -payment.amount,
    currency: payment.currency,
    status: 'refunded',
    yocoPaymentId: payment.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata: payment.metadata
  });

  console.log(`Payment refunded for user ${userId}`);
}

// Calculate period end based on billing cycle
function calculatePeriodEnd(billingCycle) {
  const now = new Date();
  
  if (billingCycle === 'yearly') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  
  return admin.firestore.Timestamp.fromDate(now);
}

// Create Yoco Checkout Session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { plan, billingCycle } = data;

  // Validate input
  if (!['pro'].includes(plan)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid plan');
  }

  if (!['monthly', 'yearly'].includes(billingCycle)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid billing cycle');
  }

  // Calculate amount (in cents)
  const amount = billingCycle === 'monthly' ? 9900 : 99000; // R99/month or R990/year

  try {
    // In production, you would call Yoco API here to create a checkout session
    // For now, return a mock checkout URL
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

// Get subscription status
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const subscriptionDoc = await db.collection('users').doc(userId).collection('subscriptions').doc('current').get();

    if (!subscriptionDoc.exists) {
      return {
        status: 'none',
        plan: 'free'
      };
    }

    return subscriptionDoc.data();
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get subscription');
  }
});

// Cancel subscription
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc('current');

    await subscriptionRef.update({
      cancelAtPeriodEnd: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to cancel subscription');
  }
});

// Reactivate subscription
exports.reactivateSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const subscriptionRef = db.collection('users').doc(userId).collection('subscriptions').doc('current');

    await subscriptionRef.update({
      cancelAtPeriodEnd: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw new functions.https.HttpsError('internal', 'Failed to reactivate subscription');
  }
});
