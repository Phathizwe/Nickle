// src/components/premium/PremiumDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import GoogleSignIn from "../auth/GoogleSignIn";
import MicrosoftSignIn from "../auth/MicrosoftSignIn";
import PremiumUpgradeDialog from "./PremiumUpgradeDialog";
import { useToast } from "../ui/use-toast";

export const PremiumDialog = ({ isOpen, onClose, isRegistering = false }) => {
  const { toast } = useToast();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleSuccess = async (user) => {
    try {
      console.log('PremiumDialog: Auth Success', { user, isRegistering });
      setLoading(true);
      setError(null);
      
      toast({
        title: "Success!",
        description: `Successfully ${isRegistering ? 'registered' : 'signed in'}!`,
      });
      
      // If registering, show upgrade dialog
      if (isRegistering) {
        onClose();
        setShowUpgradeDialog(true);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('PremiumDialog: Handler Error:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('PremiumDialog: Auth Error:', error);
    setError(error.message);
    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isRegistering
                ? 'Start your 7-day free trial with premium features'
                : 'Sign in to access your premium features'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <GoogleSignIn
                className="w-full"
                isRegistering={isRegistering}
                onSuccess={handleSuccess}
                onError={handleError}
                disabled={loading}
              />
              <MicrosoftSignIn
                className="w-full"
                isRegistering={isRegistering}
                onSuccess={handleSuccess}
                onError={handleError}
                disabled={loading}
              />
            </div>

            {/* Pricing Preview */}
            {isRegistering && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Premium Plans Available:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Annual (Save 33%)</span>
                    <span className="font-medium">R9.99/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-medium">R14.99/month</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Both plans include a 7-day free trial
                  </p>
                </div>
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              {isRegistering && ' You can cancel anytime during your trial.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <PremiumUpgradeDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
      />
    </>
  );
};

export default PremiumDialog;