# Nickle Subscription System - Deployment Guide

## ✅ Completed

1. **Subscription Management Page** - Built and tested locally
2. **Firebase Functions** - Created 5 cloud functions for Yoco integration
3. **Error Handling** - Fixed to show Free plan by default when no subscription exists
4. **Git Security** - Removed all secrets from git history
5. **Code Pushed** - All changes successfully pushed to GitHub

## 📋 Next Steps to Go Live

### 1. Deploy Firebase Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

This will deploy:
- `yocoWebhook` - Handles payment webhooks from Yoco
- `createCheckoutSession` - Creates checkout sessions
- `getSubscriptionStatus` - Gets user subscription status
- `cancelSubscription` - Cancels subscription
- `reactivateSubscription` - Reactivates subscription

### 2. Set Up Yoco Webhook

After deploying functions, you'll get a webhook URL like:
```
https://us-central1-nickle-aeab7.cloudfunctions.net/yocoWebhook
```

**Steps:**
1. Go to [Yoco Dashboard](https://portal.yoco.com/)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add Webhook**
4. Enter the webhook URL from Firebase
5. Subscribe to these events:
   - `payment.succeeded`
   - `payment.failed`
   - `payment.refunded`
6. Save the webhook

### 3. Integrate Real Yoco Checkout

Currently using mock checkout URL. Need to integrate Yoco's actual checkout:

**Option A: Yoco Inline Checkout (Recommended)**
```javascript
// In handleUpgrade function
const yoco = new window.YocoSDK({
  publicKey: 'YOUR_YOCO_PUBLIC_KEY' // test or live key
});

yoco.showPopup({
  amountInCents: billingCycle === 'monthly' ? 9900 : 99000,
  currency: 'ZAR',
  name: 'Nickle Pro Subscription',
  description: `${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} subscription`,
  callback: function (result) {
    if (result.error) {
      setError(result.error.message);
    } else {
      // Send token to Firebase function to process
      processPayment(result.id, plan, billingCycle);
    }
  }
});
```

**Option B: Yoco Checkout Page**
Use Yoco's hosted checkout page (redirect flow).

### 4. Update Firebase Function to Process Payments

Modify `createCheckoutSession` to actually charge the card using Yoco API:

```javascript
const axios = require('axios');

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const { plan, billingCycle, paymentToken } = data;
  const userId = context.auth.uid;
  
  const amount = billingCycle === 'monthly' ? 9900 : 99000;
  
  try {
    // Charge the card via Yoco API
    const response = await axios.post('https://online.yoco.com/v1/charges/', {
      token: paymentToken,
      amountInCents: amount,
      currency: 'ZAR',
      metadata: {
        userId,
        plan,
        billingCycle
      }
    }, {
      headers: {
        'Authorization': `Bearer ${functions.config().yoco.secret_key}`
      }
    });
    
    // Save subscription to Firestore
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('subscriptions')
      .doc('current')
      .set({
        plan,
        billingCycle,
        status: 'active',
        yocoPaymentId: response.data.id,
        currentPeriodStart: admin.firestore.FieldValue.serverTimestamp(),
        currentPeriodEnd: calculatePeriodEnd(billingCycle),
        cancelAtPeriodEnd: false
      });
    
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### 5. Set Firebase Config for Yoco Keys

```bash
firebase functions:config:set yoco.public_key="YOUR_YOCO_TEST_PUBLIC_KEY"
firebase functions:config:set yoco.secret_key="YOUR_YOCO_TEST_SECRET_KEY"
```

For production:
```bash
firebase functions:config:set yoco.public_key="YOUR_YOCO_LIVE_PUBLIC_KEY"
firebase functions:config:set yoco.secret_key="YOUR_YOCO_LIVE_SECRET_KEY"
```

### 6. Test End-to-End Flow

**Test Mode:**
1. Visit `/manage-subscription`
2. Click "Upgrade to Pro"
3. Choose Monthly or Yearly
4. Complete payment with Yoco test card: `4242 4242 4242 4242`
5. Verify subscription status updates
6. Check Firestore for subscription data
7. Test webhook by triggering payment events in Yoco dashboard

**Live Mode:**
1. Switch to live Yoco keys
2. Test with real card
3. Verify payment in Yoco dashboard
4. Verify subscription in Firestore

### 7. Deploy to Production

```bash
npm run build
firebase deploy
```

## 🔐 Security Checklist

- ✅ Secrets removed from git history
- ✅ `.env` file in `.gitignore`
- ✅ `serviceAccountKey.json` in `.gitignore`
- ⏳ Firebase config set for Yoco keys
- ⏳ Webhook signature verification (recommended)

## 📊 Firestore Structure

```
users/
  {userId}/
    subscriptions/
      current/
        - plan: "pro"
        - status: "active" | "past_due" | "canceled"
        - billingCycle: "monthly" | "yearly"
        - currentPeriodStart: Timestamp
        - currentPeriodEnd: Timestamp
        - cancelAtPeriodEnd: boolean
        - yocoPaymentId: string
    
    payments/
      {paymentId}/
        - amount: number (in cents)
        - currency: "ZAR"
        - status: "succeeded" | "failed" | "refunded"
        - yocoPaymentId: string
        - createdAt: Timestamp
```

## 🎯 Current Status

**Page Status:** ✅ Working locally, shows Free plan by default

**What Works:**
- Subscription management UI
- Plan comparison
- Upgrade modal
- Error handling

**What Needs Integration:**
- Real Yoco checkout (currently mock)
- Firebase Functions deployment
- Webhook setup
- Payment processing

## 📞 Support

For Yoco integration help:
- [Yoco API Docs](https://developer.yoco.com/online/)
- [Yoco Support](https://support.yoco.com/)

For Firebase help:
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
