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
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 1499, yearly: 11988 }, // R14.99/month, R119.88/year (R9.99/month)
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'Save and load calculations', included: true },
        { name: 'Advanced budget templates', included: true },
        { name: 'Custom categories', included: true },
        { name: 'Detailed financial reports', included: true },
        { name: 'Priority support', included: true }
      ]
    }
  },
  currency: 'ZAR',
  currencySymbol: 'R',
  billingCycles: {
    monthly: { id: 'monthly', name: 'Monthly' },
    yearly: { id: 'yearly', name: 'Yearly (Annual)', discount: 0.33 } // 33% savings
  }
});
