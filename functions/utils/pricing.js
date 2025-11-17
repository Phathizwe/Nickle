const admin = require('firebase-admin');

/**
 * Get pricing configuration from Firestore
 * @returns {Promise<Object>} Pricing configuration
 */
async function getPricingConfig() {
  try {
    const pricingDoc = await admin.firestore()
      .collection('config')
      .doc('pricing')
      .get();

    if (pricingDoc.exists) {
      return pricingDoc.data();
    }

    // Fallback to default pricing
    return getDefaultPricing();
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return getDefaultPricing();
  }
}

/**
 * Get price for a specific plan and billing cycle
 * @param {string} plan - Plan ID (e.g., 'pro')
 * @param {string} billingCycle - Billing cycle ('monthly' or 'yearly')
 * @returns {Promise<number>} Price in cents
 */
async function getPrice(plan, billingCycle) {
  const pricing = await getPricingConfig();
  
  if (!pricing.plans[plan]) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  return pricing.plans[plan].price[billingCycle];
}

/**
 * Calculate period end date based on billing cycle
 * @param {string} billingCycle - 'monthly' or 'yearly'
 * @param {Date} startDate - Start date (defaults to now)
 * @returns {admin.firestore.Timestamp} Period end timestamp
 */
function calculatePeriodEnd(billingCycle, startDate = new Date()) {
  const date = new Date(startDate);
  
  if (billingCycle === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  
  return admin.firestore.Timestamp.fromDate(date);
}

/**
 * Default pricing configuration (fallback)
 */
function getDefaultPricing() {
  return {
    plans: {
      free: {
        id: 'free',
        name: 'Free',
        price: { monthly: 0, yearly: 0 }
      },
      pro: {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 9900, yearly: 99000 }
      }
    },
    currency: 'ZAR',
    currencySymbol: 'R'
  };
}

module.exports = {
  getPricingConfig,
  getPrice,
  calculatePeriodEnd
};
