import React, { useState } from 'react';
import { usePricing } from '../../hooks/usePricing';
import { useSubscription } from '../../hooks/useSubscription';
import CurrentPlanCard from './CurrentPlanCard';
import PlanFeaturesCard from './PlanFeaturesCard';
import BillingHistoryCard from './BillingHistoryCard';
import UpgradeModal from './UpgradeModal';
import './ManageSubscription.css';

const ManageSubscription = () => {
  const { pricing, loading: pricingLoading } = usePricing();
  const {
    subscription,
    payments,
    loading: subLoading,
    createCheckout,
    cancelSubscription,
    reactivateSubscription
  } = useSubscription();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const loading = pricingLoading || subLoading;

  const handleUpgrade = async (plan, billingCycle) => {
    try {
      const result = await createCheckout(plan, billingCycle);
      // Redirect to Yoco checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      alert('Failed to create checkout session. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will keep access until the end of your billing period.'
    );
    
    if (!confirmed) return;

    try {
      await cancelSubscription();
      alert('Subscription canceled successfully');
    } catch (err) {
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription();
      alert('Subscription reactivated successfully');
    } catch (err) {
      alert('Failed to reactivate subscription. Please try again.');
    }
  };

  const handleRetryPayment = () => {
    if (subscription) {
      handleUpgrade(subscription.plan, subscription.billingCycle);
    }
  };

  if (loading) {
    return (
      <div className="manage-subscription">
        <div className="loading">Loading subscription data...</div>
      </div>
    );
  }

  const isFree = !subscription || subscription.plan === 'free' || subscription.status === 'none';

  return (
    <div className="manage-subscription">
      <div className="subscription-container">
        <h1>Manage Subscription</h1>

        <CurrentPlanCard
          subscription={subscription}
          pricing={pricing}
          onUpgrade={() => setShowUpgradeModal(true)}
          onCancel={handleCancelSubscription}
          onReactivate={handleReactivateSubscription}
          onRetryPayment={handleRetryPayment}
        />

        <PlanFeaturesCard
          pricing={pricing}
          isFree={isFree}
          onUpgrade={handleUpgrade}
        />

        {!isFree && (
          <BillingHistoryCard
            payments={payments}
            currencySymbol={pricing?.currencySymbol}
          />
        )}
      </div>

      <UpgradeModal
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        pricing={pricing}
        onSelectPlan={handleUpgrade}
      />
    </div>
  );
};

export default ManageSubscription;
