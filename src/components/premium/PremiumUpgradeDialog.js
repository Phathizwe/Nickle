// src/components/premium/PremiumUpgradeDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { initYocoSDK, processPayment } from '../services/yocoService';

export const PremiumUpgradeDialog = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [yocoSDK, setYocoSDK] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('annual'); // Default to annual

  useEffect(() => {
    const loadYocoSDK = async () => {
      try {
        const sdk = await initYocoSDK();
        setYocoSDK(sdk);
      } catch (err) {
        console.error('Failed to load Yoco SDK:', err);
        setError('Failed to initialize payment system');
      }
    };

    if (isOpen && !yocoSDK) {
      loadYocoSDK();
    }
  }, [isOpen]);

  const handleUpgrade = async () => {
    if (!user || !yocoSDK) return;

    try {
      setLoading(true);
      setError(null);

      // Process payment with Yoco - include plan type
      const result = await processPayment(user.uid, yocoSDK, selectedPlan);
      
      toast({
        title: "Success!",
        description: "Your premium subscription is now active!",
      });
      
      onUpgradeSuccess?.(result);
      onClose();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment');
      toast({
        title: "Payment Failed",
        description: err.message || 'Failed to process payment',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Save unlimited calculations",
    "Access calculation history",
    "Export detailed PDF reports",
    "Sync across devices",
    "Priority support"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Premium Plan
          </DialogTitle>
          <DialogDescription className="text-center">
            Start with a 7-day free trial
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Plan Selection */}
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedPlan === 'annual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setSelectedPlan('annual')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Annual Plan</h3>
                  <p className="text-sm text-gray-600">Save 33% with annual billing</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R9.99</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Billed as R119.88 once yearly</p>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedPlan === 'monthly'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Monthly Plan</h3>
                  <p className="text-sm text-gray-600">Maximum flexibility</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R14.99</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Premium Features Include:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleUpgrade}
            disabled={loading || !yocoSDK}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Start Free Trial'
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            You can cancel anytime during the trial. After the trial, you'll be billed 
            {selectedPlan === 'annual' 
              ? ' R119.88 annually (R9.99/month)' 
              : ' R14.99 monthly'
            }.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeDialog;