// src/components/services/yocoService.js
import { db } from '../../firebase-config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Yoco SDK
export const initYocoSDK = () => {
  return new Promise((resolve, reject) => {
    try {
      if (window.YocoSDK) {
        resolve(new window.YocoSDK({
          publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY
        }));
      } else {
        const script = document.createElement('script');
        script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
        script.onload = () => {
          const sdk = new window.YocoSDK({
            publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY
          });
          resolve(sdk);
        };
        script.onerror = (error) => {
          reject(new Error('Failed to load Yoco SDK'));
        };
        document.head.appendChild(script);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const PLAN_CONFIGS = {
  annual: {
    amountInCents: 11988, // R119.88 annually (R9.99 per month)
    description: '7-day free trial, then R119.88/year (R9.99/month)',
    interval: 'annual',
    displayAmount: 'R119.88/year'
  },
  monthly: {
    amountInCents: 1499, // R14.99 monthly
    description: '7-day free trial, then R14.99/month',
    interval: 'monthly',
    displayAmount: 'R14.99/month'
  }
};

export const createSubscription = async (userId, planType = 'annual') => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionDoc = await getDoc(subscriptionRef);

    // Check if active subscription exists
    if (subscriptionDoc.exists()) {
      const data = subscriptionDoc.data();
      if (data.status === 'active' || data.status === 'trialing') {
        throw new Error('Active subscription already exists');
      }
    }

    const planConfig = PLAN_CONFIGS[planType];
    if (!planConfig) {
      throw new Error('Invalid plan type');
    }

    // Create new subscription record
    const subscriptionData = {
      userId,
      status: 'pending',
      createdAt: serverTimestamp(),
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
      amount: planConfig.amountInCents,
      currency: 'ZAR',
      plan: 'premium',
      interval: planConfig.interval,
      provider: 'yoco',
      billingType: planType
    };

    await setDoc(subscriptionRef, subscriptionData);
    return subscriptionRef.id;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const processPayment = async (userId, yocoSDK, planType = 'annual') => {
  try {
    const planConfig = PLAN_CONFIGS[planType];
    if (!planConfig) {
      throw new Error('Invalid plan type');
    }

    const subscriptionId = await createSubscription(userId, planType);
    
    return new Promise((resolve, reject) => {
      yocoSDK.showPopup({
        amountInCents: planConfig.amountInCents,
        currency: 'ZAR',
        name: 'Nickle Premium Subscription',
        description: planConfig.description,
        metadata: {
          subscriptionId,
          userId,
          planType,
          interval: planConfig.interval
        },
        callback: async function(result) {
          if (result.error) {
            reject(result.error);
          } else {
            try {
              // Update subscription with payment details
              const subscriptionRef = doc(db, 'subscriptions', userId);
              await updateDoc(subscriptionRef, {
                status: 'trialing',
                paymentId: result.id,
                cardToken: result.cardToken,
                lastPaymentDate: serverTimestamp(),
                updatedAt: serverTimestamp(),
                nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // After trial
                billingAmount: planConfig.amountInCents,
                displayAmount: planConfig.displayAmount
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }
        }
      });
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};