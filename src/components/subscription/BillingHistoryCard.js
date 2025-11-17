import React from 'react';
import './ManageSubscription.css';

const BillingHistoryCard = ({ payments, currencySymbol = 'R' }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatAmount = (amount) => {
    return `${currencySymbol} ${(amount / 100).toFixed(2)}`;
  };

  return (
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
  );
};

export default BillingHistoryCard;
