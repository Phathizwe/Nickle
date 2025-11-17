import React from 'react';
import './ManageSubscription.css';

const CurrentPlanCard = ({ 
  subscription, 
  pricing,
  onUpgrade, 
  onCancel, 
  onReactivate,
  onRetryPayment 
}) => {
  const isFree = !subscription || subscription.plan === 'free' || subscription.status === 'none';
  const isPastDue = subscription && subscription.status === 'past_due';
  const isCanceling = subscription && subscription.cancelAtPeriodEnd;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getPrice = () => {
    if (!pricing || !subscription) return '';
    const plan = pricing.plans[subscription.plan];
    if (!plan) return '';
    const amount = plan.price[subscription.billingCycle];
    return `${pricing.currencySymbol} ${(amount / 100).toFixed(0)}/${subscription.billingCycle === 'monthly' ? 'month' : 'year'}`;
  };

  return (
    <div className="subscription-card">
      <div className="card-header">
        <h2>Current Plan</h2>
        <span className={`status-badge ${subscription?.status || 'none'}`}>
          {subscription?.status === 'active' && '✓ Active'}
          {subscription?.status === 'past_due' && '⚠ Payment Failed'}
          {subscription?.status === 'canceled' && '✗ Canceled'}
          {(!subscription || subscription.status === 'none') && 'Free Plan'}
        </span>
      </div>

      <div className="plan-details">
        {isFree ? (
          <>
            <h3>Free Plan</h3>
            <p>You're currently on the free plan with limited features.</p>
            <button className="btn-primary" onClick={onUpgrade}>
              Upgrade to Pro
            </button>
          </>
        ) : (
          <>
            <h3>Pro Plan</h3>
            <p className="billing-cycle">
              {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
            </p>
            
            <div className="billing-info">
              <div className="info-row">
                <span>Current period:</span>
                <span>{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</span>
              </div>
              <div className="info-row">
                <span>Next billing date:</span>
                <span>{formatDate(subscription.currentPeriodEnd)}</span>
              </div>
              <div className="info-row">
                <span>Amount:</span>
                <span className="amount">{getPrice()}</span>
              </div>
            </div>

            {isPastDue && (
              <div className="alert alert-warning">
                <strong>Payment Failed</strong>
                <p>Your last payment failed. Please update your payment method and retry.</p>
                <button className="btn-warning" onClick={onRetryPayment}>
                  Retry Payment
                </button>
              </div>
            )}

            {isCanceling && (
              <div className="alert alert-info">
                <strong>Subscription Canceling</strong>
                <p>Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You'll keep access until then.</p>
                <button className="btn-secondary" onClick={onReactivate}>
                  Reactivate Subscription
                </button>
              </div>
            )}

            {!isCanceling && subscription.status === 'active' && (
              <div className="action-buttons">
                <button className="btn-secondary" onClick={onUpgrade}>
                  Change Plan
                </button>
                <button className="btn-danger" onClick={onCancel}>
                  Cancel Subscription
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CurrentPlanCard;
