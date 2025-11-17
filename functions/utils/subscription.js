const admin = require('firebase-admin');
const { calculatePeriodEnd } = require('./pricing');

/**
 * Update subscription status in Firestore
 * @param {string} userId - User ID
 * @param {Object} data - Subscription data
 */
async function updateSubscription(userId, data) {
  const subscriptionRef = admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('subscriptions')
    .doc('current');

  await subscriptionRef.set({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

/**
 * Record payment in Firestore
 * @param {string} userId - User ID
 * @param {Object} paymentData - Payment data
 */
async function recordPayment(userId, paymentData) {
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('payments')
    .add({
      ...paymentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
}

/**
 * Get subscription for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Subscription data or null
 */
async function getSubscription(userId) {
  const subscriptionDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('subscriptions')
    .doc('current')
    .get();

  if (!subscriptionDoc.exists) {
    return null;
  }

  return subscriptionDoc.data();
}

/**
 * Activate subscription for a user
 * @param {string} userId - User ID
 * @param {string} plan - Plan ID
 * @param {string} billingCycle - Billing cycle
 * @param {string} yocoPaymentId - Yoco payment ID
 */
async function activateSubscription(userId, plan, billingCycle, yocoPaymentId) {
  await updateSubscription(userId, {
    status: 'active',
    plan,
    billingCycle,
    currentPeriodStart: admin.firestore.FieldValue.serverTimestamp(),
    currentPeriodEnd: calculatePeriodEnd(billingCycle),
    cancelAtPeriodEnd: false,
    yocoPaymentId
  });
}

module.exports = {
  updateSubscription,
  recordPayment,
  getSubscription,
  activateSubscription
};
