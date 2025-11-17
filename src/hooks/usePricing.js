import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Custom hook to fetch pricing configuration from Firestore
 * @returns {Object} { pricing, loading, error }
 */
export const usePricing = () => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        const pricingDoc = await getDoc(doc(db, 'config', 'pricing'));
        
        if (pricingDoc.exists()) {
          setPricing(pricingDoc.data());
        } else {
          // Fallback to default pricing if not in Firestore yet
          setPricing(getDefaultPricing());
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching pricing:', err);
        setError(err.message);
        // Use default pricing on error
        setPricing(getDefaultPricing());
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  return { pricing, loading, error };
};

/**
 * Default pricing configuration (fallback)
 */
const getDefaultPricing = () => ({
  plans: {
    free: {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: 'Basic budget tracking', included: true },
        { name: 'House calculator', included: true },
        { name: 'Car calculator', included: true },
        { name: 'PDF exports', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 9900, yearly: 99000 },
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'PDF exports', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom categories', included: true },
        { name: 'Unlimited budgets', included: true }
      ]
    }
  },
  currency: 'ZAR',
  currencySymbol: 'R',
  billingCycles: {
    monthly: { id: 'monthly', name: 'Monthly' },
    yearly: { id: 'yearly', name: 'Yearly', discount: 0.17 }
  }
});
