import React from 'react';
import './ManageSubscription.css';

const UpgradeModal = ({ show, onClose, pricing, onSelectPlan }) => {
  if (!show || !pricing || !pricing.plans) return null;

  const proPlan = pricing.plans.pro;
  const monthlyPrice = proPlan.price.monthly;
  const yearlyPrice = proPlan.price.yearly;
  const discount = pricing.billingCycles.yearly.discount;

  const formatPrice = (amount) => {
    return `${pricing.currencySymbol} ${(amount / 100).toFixed(0)}`;
  };

  const calculateMonthlyEquivalent = (yearlyAmount) => {
    return (yearlyAmount / 12 / 100).toFixed(2);
  };

  const calculateSavings = () => {
    return Math.round(discount * 100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Choose Your Plan</h2>
        
        <div className="upgrade-options">
          <div className="upgrade-option">
            <h3>Monthly</h3>
            <div className="price">
              {formatPrice(monthlyPrice)}
              <span>/month</span>
            </div>
            <p>Billed monthly</p>
            <button 
              className="btn-primary" 
              onClick={() => onSelectPlan('pro', 'monthly')}
            >
              Choose Monthly
            </button>
          </div>

          <div className="upgrade-option recommended">
            <div className="recommended-badge">Save {calculateSavings()}%</div>
            <h3>Yearly</h3>
            <div className="price">
              {formatPrice(yearlyPrice)}
              <span>/year</span>
            </div>
            <p>
              Billed annually ({pricing.currencySymbol} {calculateMonthlyEquivalent(yearlyPrice)}/month)
            </p>
            <button 
              className="btn-primary" 
              onClick={() => onSelectPlan('pro', 'yearly')}
            >
              Choose Yearly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
