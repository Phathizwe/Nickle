// src/subscription/ManageSubscription.js
import React, { useState } from 'react';
import { useAuth } from '../components/contexts/AuthContext';
import { useSubscription } from '../components/contexts/SubscriptionContext';
import { useToast } from '../components/ui/use-toast';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Loader2, Shield, AlertTriangle } from "lucide-react";

const ManageSubscription = () => {
  const { user } = useAuth();
  const { subscription, cancelSubscription } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await cancelSubscription(user.uid);
      setShowCancelDialog(false);
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the current billing period.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert>
          <AlertDescription>
            No active subscription found. Please upgrade to access premium features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Manage Subscription</h1>
        <p className="text-gray-600 mt-2">
          View and manage your premium subscription details
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <CardTitle>Premium Subscription</CardTitle>
          </div>
          <CardDescription>
            Your premium subscription details and management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="font-medium">
                {subscription?.status === 'trialing' ? 'Trial Active' : 'Active'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Plan</p>
              <p className="font-medium">
                {subscription?.billingType === 'annual' ? 'Premium Annual' : 'Premium Monthly'}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Started On</p>
              <p className="font-medium">{formatDate(subscription?.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                {subscription?.status === 'trialing' ? 'Trial Ends' : 'Next Billing Date'}
              </p>
              <p className="font-medium">
                {subscription?.status === 'trialing'
                  ? formatDate(subscription?.trialEndDate)
                  : formatDate(subscription?.currentPeriodEnd)}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Payment Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="font-medium">
                  {subscription?.billingType === 'annual' ? 'R9.99/month' : 'R14.99/month'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {subscription?.paymentMethod || 'Card ending in ****'}
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation */}
          <div className="pt-4 border-t">
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Want to cancel your subscription?</AlertTitle>
              <AlertDescription>
                You'll continue to have access to premium features until the end of your current billing period.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={loading}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your premium subscription? You'll lose access to premium features at the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={loading}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Subscription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSubscription;