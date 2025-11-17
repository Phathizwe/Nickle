# Yoco Integration Plan for Nickle Subscription Management

## Overview
Building a comprehensive subscription management system with Yoco payments and Firebase backend.

## Yoco APIs Available

### 1. Checkout API
- **Purpose:** Accept payments online using a secure payment page
- **Use case:** Initial subscription signup, payment retries
- **Key features:**
  - Hosted payment page
  - Secure card collection
  - Webhook notifications

### 2. Yoco API (REST)
- **Purpose:** Fetch real-time information (orders, payments, and more)
- **Use case:** View payment history, check payment status
- **Key features:**
  - Orders
  - Payments
  - Payouts
  - Refunds
  - Payment Links

## Subscription Management Features to Build

### 1. View Subscription Status
- Current plan (Free/Pro)
- Billing cycle (monthly/yearly)
- Next billing date
- Payment status (active/past_due/canceled)

### 2. Upgrade/Downgrade
- Change plan (Free ↔ Pro)
- Change billing cycle (monthly ↔ yearly)
- Prorated billing

### 3. Payment Management
- View current payment method (last 4 digits)
- Update credit card details
- Retry failed payments
- View payment history

### 4. Billing History
- List of past payments
- Download invoices
- View payment status

### 5. Cancellation
- Cancel subscription
- Reactivate subscription
- Keep access until end of billing period

## Firebase Structure

### Firestore Collections

```
users/{userId}
  - email
  - displayName
  - createdAt
  
  subscriptions/{subscriptionId}
    - plan: "free" | "pro"
    - status: "active" | "past_due" | "canceled"
    - billingCycle: "monthly" | "yearly"
    - currentPeriodStart: timestamp
    - currentPeriodEnd: timestamp
    - cancelAtPeriodEnd: boolean
    - yocoCustomerId: string
    
  payments/{paymentId}
    - amount: number
    - currency: "ZAR"
    - status: "succeeded" | "failed" | "pending"
    - yocoPaymentId: string
    - createdAt: timestamp
    - invoiceUrl: string
```

## Yoco Keys

### Test Keys
- Public: `pk_test_xxxxx` (stored in .env)
- Secret: `sk_test_xxxxx` (stored in Firebase Functions config)

### Live Keys
- Public: `pk_live_xxxxx` (stored in .env)
- Secret: `sk_live_xxxxx` (stored in Firebase Functions config)

## Implementation Steps

1. **Frontend:**
   - Create ManageSubscription.js component
   - Integrate Yoco Checkout SDK
   - Display subscription status
   - Payment retry UI

2. **Backend (Firebase Functions):**
   - Webhook handler for Yoco events
   - Create checkout session
   - Update subscription status
   - Handle payment failures

3. **Security:**
   - Store secret keys in Firebase Functions config
   - Validate webhook signatures
   - Secure API endpoints with Firebase Auth

## Next Steps
1. Set up Firebase Functions
2. Create ManageSubscription component
3. Integrate Yoco Checkout
4. Set up webhook handlers
5. Test with test keys
6. Deploy to production with live keys
