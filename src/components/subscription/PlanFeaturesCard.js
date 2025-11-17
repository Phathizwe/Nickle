import React from 'react';
import './ManageSubscription.css';

const PlanFeaturesCard = ({ pricing, isFree, onUpgrade }) => {
  if (!pricing || !pricing.plans) return null;

  const freePlan = pricing.plans.free;
  const proPlan = pricing.plans.pro;

  const formatPrice = (amount, billingCycle) => {
    if (amount === 0) return 'Free';
    const price = (amount / 100).toFixed(0);
    return `${pricing.currencySymbol} ${price}/${billingCycle === 'monthly' ? 'month' : 'year'}`;
  };

  const renderFeature = (feature) => {
    const icon = feature.included ? '✓' : '✗';
    return (
      <li key={feature.name}>
        {icon} {feature.name}
      </li>
    );
  };

  return (
    <div className="subscription-card">
      <h2>Plan Features</h2>
      
      <div className="plans-comparison">
        <div className="plan-column">
          <h3>{freePlan.name}</h3>
          <ul className="features-list">
            {freePlan.features.map(renderFeature)}
          </ul>
        </div>

        <div className="plan-column pro">
          <h3>{proPlan.name}</h3>
          <div className="price">
            {formatPrice(proPlan.price.monthly, 'monthly')}
          </div>
          <ul className="features-list">
            {proPlan.features.map(renderFeature)}
          </ul>
          {isFree && (
            <button 
              className="btn-primary" 
              onClick={() => onUpgrade('pro', 'monthly')}
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanFeaturesCard;
