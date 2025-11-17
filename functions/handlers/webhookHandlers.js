const { activateSubscription, updateSubscription, recordPayment } = require('../utils/subscription');

/**
 * Handle successful payment webhook
 * @param {Object} payment - Payment data from Yoco
 */
async function handlePaymentSucceeded(payment) {
  const userId = payment.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in payment metadata');
    return;
  }

  const plan = payment.metadata.plan || 'premium';
  const billingCycle = payment.metadata.billingCycle || 'monthly';

  // Activate subscription
  await activateSubscription(userId, plan, billingCycle, payment.id);

  // Record successful payment
  await recordPayment(userId, {
    amount: payment.amount,
    currency: payment.currency,
    status: 'succeeded',
    yocoPaymentId: payment.id,
    metadata: payment.metadata
  });

  console.log(`Payment succeeded for user ${userId}`);
}

/**
 * Handle failed payment webhook
 * @param {Object} payment - Payment data from Yoco
 */
async function handlePaymentFailed(payment) {
  const userId = payment.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in payment metadata');
    return;
  }

  // Update subscription status to past_due
  await updateSubscription(userId, {
    status: 'past_due'
  });

  // Record failed payment
  await recordPayment(userId, {
    amount: payment.amount,
    currency: payment.currency,
    status: 'failed',
    yocoPaymentId: payment.id,
    metadata: payment.metadata,
    failureReason: payment.failureReason
  });

  console.log(`Payment failed for user ${userId}`);
}

/**
 * Handle refunded payment webhook
 * @param {Object} payment - Payment data from Yoco
 */
async function handlePaymentRefunded(payment) {
  const userId = payment.metadata?.userId;
  
  if (!userId) {
    console.error('No userId in payment metadata');
    return;
  }

  // Record refund
  await recordPayment(userId, {
    amount: -payment.amount,
    currency: payment.currency,
    status: 'refunded',
    yocoPaymentId: payment.id,
    metadata: payment.metadata
  });

  console.log(`Payment refunded for user ${userId}`);
}

module.exports = {
  handlePaymentSucceeded,
  handlePaymentFailed,
  handlePaymentRefunded
};
