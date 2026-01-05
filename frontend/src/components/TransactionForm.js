import React from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="no-transactions">
        <p>Aucune transaction trouvée. Commencez par en ajouter une !</p>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h3>Historique des Transactions</h3>
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Catégorie</th>
              <th>Montant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className={t.type}>
                <td>{formatDate(t.date)}</td>
                <td>{t.description || '-'}</td>
                <td><span className="category-tag">{t.category}</span></td>
                <td className="amount-cell">
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </td>
                <td className="actions-cell">
                  <button onClick={() => onEdit(t)} className="btn-edit" title="Modifier">
                    ✏️
                  </button>
                  <button onClick={() => onDelete(t._id)} className="btn-delete" title="Supprimer">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;