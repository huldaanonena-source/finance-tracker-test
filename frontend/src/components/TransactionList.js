import React from 'react';
import './TransactionList.css';
const TransactionList = ({ transactions = [] }) => { // Le " = [] " est crucial ici
  
  // Si les transactions sont en cours de chargement ou vides
  if (!transactions || transactions.length === 0) {
    return <p className="no-data">Aucune transaction à afficher pour le moment.</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
          {/* Le reste de votre code existant ici... */}
        </div>
      ))}
    </div>
  );
};
export default TransactionList;
