/**
 * Initialize Pricing Configuration in Firestore
 * Run this once to set up pricing data that can be updated without code changes
 * 
 * Usage: node scripts/initializePricing.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../functions/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const pricingConfig = {
  plans: {
    free: {
      id: 'free',
      name: 'Free',
      description: 'Basic financial planning tools',
      price: {
        monthly: 0,
        yearly: 0
      },
      features: [
        { name: 'Basic budget tracking', included: true },
        { name: 'House calculator', included: true },
        { name: 'Car calculator', included: true },
        { name: 'PDF exports', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false }
      ],
      limits: {
        budgets: 1,
        categories: 10
      }
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      description: 'Full-featured budgeting and analytics',
      price: {
        monthly: 9900, // R99 in cents
        yearly: 99000  // R990 in cents (17% savings)
      },
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'PDF exports', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom categories', included: true },
        { name: 'Unlimited budgets', included: true }
      ],
      limits: {
        budgets: -1, // unlimited
        categories: -1 // unlimited
      }
    }
  },
  currency: 'ZAR',
  currencySymbol: 'R',
  taxRate: 0, // No VAT for now
  billingCycles: {
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      interval: 'month',
      intervalCount: 1
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      interval: 'year',
      intervalCount: 1,
      discount: 0.17 // 17% discount
    }
  }
};

async function initializePricing() {
  try {
    console.log('Initializing pricing configuration in Firestore...');
    
    // Store pricing config
    await db.collection('config').doc('pricing').set(pricingConfig);
    
    console.log('✅ Pricing configuration initialized successfully!');
    console.log('\nPricing Summary:');
    console.log('- Free Plan: R0');
    console.log('- Pro Plan Monthly: R99/month');
    console.log('- Pro Plan Yearly: R990/year (R82.50/month - Save 17%)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing pricing:', error);
    process.exit(1);
  }
}

initializePricing();
