// src/components/premium/PremiumFeatureDialog.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useToast } from "../ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { initYocoSDK, processPayment } from '../services/yocoService';

export const PremiumFeatureDialog = ({ 
  isOpen, 
  onClose, 
  feature = 'this feature',
  description,
  onUpgradeSuccess,
  onRegisterRequired
}) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [yocoSDK, setYocoSDK] = useState(null);

  useEffect(() => {
    if (isOpen && !yocoSDK) {
      initYocoSDK()
        .then(sdk => setYocoSDK(sdk))
        .catch(err => {
          console.error('Failed to initialize Yoco SDK:', err);
          setError('Failed to initialize payment system');
        });
    }
  }, [isOpen]);

  const handleUpgradeClick = async () => {
    if (!user) {
      onClose();
      onRegisterRequired?.();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Process payment with Yoco
      const result = await processPayment(user.uid, yocoSDK);
      
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

  // Handle subscription status
  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
  if (isSubscribed) {
    return null; // Don't show dialog if already subscribed
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center">
            {description || `Get access to ${feature} and all premium features with a 7-day free trial`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Features List */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
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

          {/* Pricing */}
          <div className="text-center space-y-2 mb-6">
            <p className="text-2xl font-bold">7-Day Free Trial</p>
            <p className="text-gray-600">Then R9.99/month</p>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="flex flex-col gap-4 sm:flex-row">
            <Button
              onClick={handleUpgradeClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400"
              disabled={loading || !yocoSDK}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start Free Trial'
              )}
            </Button>
          </DialogFooter>

          {/* Terms */}
          <div className="mt-4">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              You can cancel anytime during the trial.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// PropTypes
PremiumFeatureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  feature: PropTypes.string,
  description: PropTypes.string,
  onUpgradeSuccess: PropTypes.func,
  onRegisterRequired: PropTypes.func
};

export default PremiumFeatureDialog;