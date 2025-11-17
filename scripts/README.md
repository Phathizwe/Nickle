# Nickle Scripts

## Initialize Pricing Configuration

This script sets up the pricing configuration in Firestore so that all pricing is centralized and can be updated without code changes.

### Prerequisites

1. Firebase Admin SDK credentials (`functions/serviceAccountKey.json`)
2. Node.js installed
3. Firebase Admin package installed

### Usage

```bash
cd /home/ubuntu/Nickle
npm install firebase-admin --prefix scripts
node scripts/initializePricing.js
```

### What It Does

- Creates a `config/pricing` document in Firestore
- Sets up Free and Pro plan pricing
- Configures billing cycles (monthly and yearly)
- Defines plan features and limits

### Pricing Structure

The script creates this structure in Firestore:

```javascript
{
  plans: {
    free: {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [...],
      limits: { budgets: 1, categories: 10 }
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 9900, yearly: 99000 }, // in cents
      features: [...],
      limits: { budgets: -1, categories: -1 } // unlimited
    }
  },
  currency: 'ZAR',
  currencySymbol: 'R',
  billingCycles: {
    monthly: { id: 'monthly', name: 'Monthly', ... },
    yearly: { id: 'yearly', name: 'Yearly', discount: 0.17 }
  }
}
```

### Updating Pricing

To update pricing in the future, you can either:

1. **Run the script again** with modified values
2. **Update directly in Firebase Console**: `Firestore > config > pricing`
3. **Use Firebase Admin SDK** in your own script

All pricing changes take effect immediately without code deployment!
