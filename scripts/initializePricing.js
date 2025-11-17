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
        { name: 'Basic budget planning', included: true },
        { name: 'Vehicle cost calculator', included: true },
        { name: 'House cost calculator', included: true },
        { name: 'Standard calculations', included: true },
        { name: 'Basic templates', included: true },
        { name: 'Save and load calculations', included: false },
        { name: 'Advanced budget templates', included: false },
        { name: 'Custom categories', included: false },
        { name: 'Detailed financial reports', included: false },
        { name: 'Priority support', included: false }
      ],
      limits: {
        budgets: 1,
        categories: 10
      }
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      description: 'Full-featured budgeting and analytics',
      price: {
        monthly: 1499, // R14.99 in cents
        yearly: 11988  // R119.88 in cents (R9.99/month - 33% savings)
      },
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'Save and load calculations', included: true },
        { name: 'Advanced budget templates', included: true },
        { name: 'Custom categories', included: true },
        { name: 'Detailed financial reports', included: true },
        { name: 'Priority support', included: true }
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
      name: 'Yearly (Annual)',
      interval: 'year',
      intervalCount: 1,
      discount: 0.33 // 33% discount (R14.99 vs R9.99/month)
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
    console.log('- Premium Monthly: R14.99/month');
    console.log('- Premium Annual: R119.88/year (R9.99/month - Save 33%)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing pricing:', error);
    process.exit(1);
  }
}

initializePricing();
