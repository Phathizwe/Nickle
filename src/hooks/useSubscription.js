import { useState, useEffect } from 'react';
import { auth, functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';

/**
 * Custom hook to manage subscription state and operations
 * @returns {Object} subscription state and operations
 */
export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      const getSubscriptionStatus = httpsCallable(functions, 'getSubscriptionStatus');
      const result = await getSubscriptionStatus();
      
      setSubscription(result.data);
      setError(null);
    } catch (err) {
      console.error('Error loading subscription:', err);
      
      // Default to free plan if function doesn't exist or user has no subscription
      setSubscription({ plan: 'free', status: 'none' });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (plan, billingCycle) => {
    try {
      setLoading(true);
      
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({ plan, billingCycle });
      
      return result.data;
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError('Failed to create checkout session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      
      const cancelSub = httpsCallable(functions, 'cancelSubscription');
      await cancelSub();
      
      await loadSubscriptionData();
      return true;
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reactivateSubscription = async () => {
    try {
      setLoading(true);
      
      const reactivateSub = httpsCallable(functions, 'reactivateSubscription');
      await reactivateSub();
      
      await loadSubscriptionData();
      return true;
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError('Failed to reactivate subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    payments,
    loading,
    error,
    createCheckout,
    cancelSubscription,
    reactivateSubscription,
    reload: loadSubscriptionData
  };
};
