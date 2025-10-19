import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Meta from '../SEO/Meta';
import { Check, Loader2 } from "lucide-react";
import { PremiumDialog, PremiumFeatureDialog } from '../premium';
import PricingCard from './PricingCard';
import { useToast } from '../ui/use-toast';



export default function Pricing() {
  // Add debugging log
  console.log('Rendering page: Pricing');
  
  // Use auth hook
  const { user, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const { subscription, isSubscribed, isTrialing } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const handleFreePlanClick = () => {
    if (!user) {
      setIsRegistering(true);
      setShowPremiumDialog(true);
    }
  };

  const handlePremiumPlanClick = async (planType) => {
    setSelectedPlan(planType);
    if (!user) {
      setIsRegistering(true);
      setShowPremiumDialog(true);
    } else if (!isSubscribed && !isTrialing) {
      setShowUpgradeDialog(true);
    }
  };

  const handleAuthSuccess = async (authProvider) => {
    try {
      setLoading(true);
      let authResult;
      
      if (authProvider === 'google') {
        authResult = await signInWithGoogle(isRegistering);
      } else if (authProvider === 'microsoft') {
        authResult = await signInWithMicrosoft(isRegistering);
      }

      if (authResult) {
        toast({
          title: "Success!",
          description: `Successfully ${isRegistering ? 'registered' : 'signed in'}!`,
        });

        setShowPremiumDialog(false);
        if (isRegistering) {
          setShowUpgradeDialog(true);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSuccess = () => {
    setShowUpgradeDialog(false);
    toast({
      title: "Success!",
      description: "Your premium subscription is now active!",
    });
  };

  return (
    <>
      <Meta
        title="Pricing | Nickle"
        description="Choose the perfect Nickle plan for your financial planning needs."
        keywords="pricing, subscription, premium, financial planning, Nickle"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your financial planning needs
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <PricingCard
              title="Free"
              price="0"
              billingPeriod="forever"
              features={[
                "Basic budget planning",
                "Vehicle cost calculator",
                "House cost calculator",
                "Standard calculations",
                "Basic templates"
              ]}
              buttonText={user ? "Current Plan" : "Get Started"}
              onAction={handleFreePlanClick}
              loading={loading}
            />

            {/* Annual Premium Plan */}
            <PricingCard
              title="Premium Annual"
              price="9.99"
              billingPeriod="month"
              features={[
                "Everything in Free",
                "Save and load calculations",
                "Advanced budget templates",
                "Custom categories",
                "Detailed financial reports",
                "Priority support",
                "Billed R119.88 annually"
              ]}
              buttonText={
                isSubscribed && subscription?.billingType === 'annual'
                  ? "Current Plan" 
                  : isTrialing 
                    ? `Trial ends ${new Date(subscription?.trialEndDate).toLocaleDateString()}`
                    : "Start Free Trial"
              }
              onAction={() => handlePremiumPlanClick('annual')}
              loading={loading}
              highlight={true}
              showAnnualSaving={true}
            />

            {/* Monthly Premium Plan */}
            <PricingCard
              title="Premium Monthly"
              price="14.99"
              billingPeriod="month"
              features={[
                "Everything in Free",
                "Save and load calculations",
                "Advanced budget templates",
                "Custom categories",
                "Detailed financial reports",
                "Priority support",
                "Monthly flexibility"
              ]}
              buttonText={
                isSubscribed && subscription?.billingType === 'monthly'
                  ? "Current Plan" 
                  : isTrialing 
                    ? `Trial ends ${new Date(subscription?.trialEndDate).toLocaleDateString()}`
                    : "Start Free Trial"
              }
              onAction={() => handlePremiumPlanClick('monthly')}
              loading={loading}
            />
          </div>

          {/* FAQ Section */}
          {/* ... FAQ section remains the same ... */}
        </div>
      </div>

      {/* Dialogs */}
      <PremiumDialog
        isOpen={showPremiumDialog}
        isRegistering={isRegistering}
        onClose={() => setShowPremiumDialog(false)}
        onGoogleAuth={() => handleAuthSuccess('google')}
        onMicrosoftAuth={() => handleAuthSuccess('microsoft')}
      />

      <PremiumFeatureDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        feature="premium features"
        description="Get access to all premium features with a 7-day free trial"
        onUpgradeSuccess={handleUpgradeSuccess}
        onRegisterRequired={() => {
          setIsRegistering(true);
          setShowPremiumDialog(true);
        }}
      />
    </>
  );
}