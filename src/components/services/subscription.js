// src/components/services/subscription.js
import { db } from '../../firebase-config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Get subscription status for a user
 */
export const getSubscriptionStatus = async (userId) => {
  if (!userId) return null;
  
  try {
    const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
    
    if (!subscriptionDoc.exists()) {
      return null;
    }

    const data = subscriptionDoc.data();
    
    return {
      status: data.status,
      trialEndDate: data.trialEndDate,
      nextBillingDate: data.nextBillingDate,
      billingType: data.billingType,
      amount: data.amount,
      displayAmount: data.displayAmount,
      interval: data.interval
    };
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return null;
  }
};

/**
 * Save subscription data
 */
export const saveSubscription = async (userId, subscriptionData) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    await setDoc(subscriptionRef, {
      ...subscriptionData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (userId) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionDoc = await getDoc(subscriptionRef);

    if (!subscriptionDoc.exists()) {
      throw new Error('Subscription not found');
    }

    const data = subscriptionDoc.data();
    const endDate = data.billingType === 'annual' 
      ? new Date(data.nextBillingDate.toDate().getFullYear() + 1, 
                 data.nextBillingDate.toDate().getMonth(), 
                 data.nextBillingDate.toDate().getDate())
      : new Date(data.nextBillingDate);

    await updateDoc(subscriptionRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      accessEndDate: endDate,
      updatedAt: serverTimestamp()
    });

    return {
      status: 'cancelled',
      accessEndDate: endDate
    };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

export default {
  getSubscriptionStatus,
  saveSubscription,
  cancelSubscription
};