// src/components/contexts/SubscriptionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useToast } from '../ui/use-toast';

const SubscriptionContext = createContext({});

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to subscription changes
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        setSubscription(doc.exists() ? doc.data() : null);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        setError(error.message);
        setLoading(false);
        
        // Only show toast for non-permission errors
        // This prevents showing errors when users aren't logged in
        if (error.code !== 'permission-denied') {
          toast({
          title: "Error",
          description: "Failed to fetch subscription status",
          variant: "destructive",
        });
      }
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Create a new subscription
  const createSubscription = async () => {
    if (!user) throw new Error('User must be logged in');

    try {
      setError(null);
      const subscriptionRef = doc(db, 'subscriptions', user.uid);
      
      await setDoc(subscriptionRef, {
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        plan: 'premium',
        amount: 999, // R9.99 in cents
        currency: 'ZAR'
      });

      return subscriptionRef.id;
    } catch (error) {
      console.error('Error creating subscription:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update subscription status
  const updateSubscriptionStatus = async (status) => {
    if (!user) throw new Error('User must be logged in');

    try {
      setError(null);
      const subscriptionRef = doc(db, 'subscriptions', user.uid);
      
      await setDoc(subscriptionRef, {
        status,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError(error.message);
      throw error;
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user) throw new Error('User must be logged in');

    try {
      setError(null);
      const subscriptionRef = doc(db, 'subscriptions', user.uid);
      
      await setDoc(subscriptionRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    subscription,
    loading,
    error,
    createSubscription,
    updateSubscriptionStatus,
    cancelSubscription,
    isSubscribed: subscription?.status === 'active' || subscription?.status === 'trialing',
    isTrialing: subscription?.status === 'trialing',
    isPending: subscription?.status === 'pending',
    isCancelled: subscription?.status === 'cancelled',
    trialEndsAt: subscription?.trialEndDate,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;