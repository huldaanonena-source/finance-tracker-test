import React from 'react';
import './Summary.css';

const Summary = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="summary-container">
      <div className="summary-card balance">
        <h3>Solde Total</h3>
        <p className="amount">{formatCurrency(summary.balance)}</p>
      </div>

      <div className="summary-card income">
        <h3>Revenus</h3>
        <p className="amount">+{formatCurrency(summary.totalIncome)}</p>
      </div>

      <div className="summary-card expense">
        <h3>Dépenses</h3>
        <p className="amount">-{formatCurrency(summary.totalExpense)}</p>
      </div>
    </div>
  );
};

export default Summary;