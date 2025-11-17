import React, { useState, useEffect } from 'react';
import { auth, functions } from '../../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import './ManageSubscription.css';

const ManageSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Get subscription status
      const getSubscriptionStatus = httpsCallable(functions, 'getSubscriptionStatus');
      const result = await getSubscriptionStatus();
      
      setSubscription(result.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading subscription:', err);
      
      // If the function doesn't exist or user has no subscription, default to free plan
      setSubscription({ plan: 'free', status: 'none' });
      setError(null);
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan, billingCycle) => {
    try {
      setLoading(true);
      
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({ plan, billingCycle });
      
      // Redirect to Yoco checkout
      window.location.href = result.data.checkoutUrl;
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError('Failed to create checkout session');
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will keep access until the end of your billing period.')) {
      return;
    }

    try {
      setLoading(true);
      
      const cancelSubscription = httpsCallable(functions, 'cancelSubscription');
      await cancelSubscription();
      
      await loadSubscriptionData();
      alert('Subscription canceled successfully');
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError('Failed to cancel subscription');
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      
      const reactivateSubscription = httpsCallable(functions, 'reactivateSubscription');
      await reactivateSubscription();
      
      await loadSubscriptionData();
      alert('Subscription reactivated successfully');
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      setError('Failed to reactivate subscription');
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatAmount = (amount) => {
    return `R ${(amount / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="manage-subscription">
        <div className="loading">Loading subscription data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-subscription">
        <div className="error">{error}</div>
      </div>
    );
  }

  const isFree = !subscription || subscription.plan === 'free' || subscription.status === 'none';
  const isPastDue = subscription && subscription.status === 'past_due';
  const isCanceling = subscription && subscription.cancelAtPeriodEnd;

  return (
    <div className="manage-subscription">
      <div className="subscription-container">
        <h1>Manage Subscription</h1>

        {/* Current Plan */}
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
                <button className="btn-primary" onClick={() => setShowUpgradeModal(true)}>
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
                    <span className="amount">
                      {subscription.billingCycle === 'monthly' ? 'R 99/month' : 'R 990/year'}
                    </span>
                  </div>
                </div>

                {isPastDue && (
                  <div className="alert alert-warning">
                    <strong>Payment Failed</strong>
                    <p>Your last payment failed. Please update your payment method and retry.</p>
                    <button className="btn-warning" onClick={() => handleUpgrade(subscription.plan, subscription.billingCycle)}>
                      Retry Payment
                    </button>
                  </div>
                )}

                {isCanceling && (
                  <div className="alert alert-info">
                    <strong>Subscription Canceling</strong>
                    <p>Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You'll keep access until then.</p>
                    <button className="btn-secondary" onClick={handleReactivateSubscription}>
                      Reactivate Subscription
                    </button>
                  </div>
                )}

                {!isCanceling && subscription.status === 'active' && (
                  <div className="action-buttons">
                    <button className="btn-secondary" onClick={() => setShowUpgradeModal(true)}>
                      Change Plan
                    </button>
                    <button className="btn-danger" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Plan Features */}
        <div className="subscription-card">
          <h2>Plan Features</h2>
          
          <div className="plans-comparison">
            <div className="plan-column">
              <h3>Free</h3>
              <ul className="features-list">
                <li>✓ Basic budget tracking</li>
                <li>✓ House calculator</li>
                <li>✓ Car calculator</li>
                <li>✗ PDF exports</li>
                <li>✗ Advanced analytics</li>
                <li>✗ Priority support</li>
              </ul>
            </div>

            <div className="plan-column pro">
              <h3>Pro</h3>
              <div className="price">R 99/month</div>
              <ul className="features-list">
                <li>✓ Everything in Free</li>
                <li>✓ PDF exports</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ Custom categories</li>
                <li>✓ Unlimited budgets</li>
              </ul>
              {isFree && (
                <button className="btn-primary" onClick={() => handleUpgrade('pro', 'monthly')}>
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Billing History */}
        {!isFree && (
          <div className="subscription-card">
            <h2>Billing History</h2>
            
            {payments.length === 0 ? (
              <p className="no-payments">No payment history yet.</p>
            ) : (
              <div className="payments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{formatDate(payment.createdAt)}</td>
                        <td>{formatAmount(payment.amount)}</td>
                        <td>
                          <span className={`payment-status ${payment.status}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td>
                          {payment.invoiceUrl && (
                            <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>×</button>
            
            <h2>Choose Your Plan</h2>
            
            <div className="upgrade-options">
              <div className="upgrade-option">
                <h3>Monthly</h3>
                <div className="price">R 99<span>/month</span></div>
                <p>Billed monthly</p>
                <button className="btn-primary" onClick={() => handleUpgrade('pro', 'monthly')}>
                  Choose Monthly
                </button>
              </div>

              <div className="upgrade-option recommended">
                <div className="recommended-badge">Save 17%</div>
                <h3>Yearly</h3>
                <div className="price">R 990<span>/year</span></div>
                <p>Billed annually (R 82.50/month)</p>
                <button className="btn-primary" onClick={() => handleUpgrade('pro', 'yearly')}>
                  Choose Yearly
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
