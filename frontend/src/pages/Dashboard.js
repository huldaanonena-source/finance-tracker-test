import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Summary from '../components/Summary';
import Chart from '../components/Chart';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expensesByCategory: {}
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fonction pour charger toutes les données depuis le backend
  const fetchData = async () => {
    try {
      // Correction des endpoints : /summary devient /transactions/summary
      const [transactionsRes, summaryRes] = await Promise.all([
        axios.get('/transactions'),
        axios.get('/transactions/summary')
      ]);

      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
      if (error.response?.status === 401) {
        logout(); // Déconnexion si le token est invalide
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les données dès que l'utilisateur est authentifié
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Ajouter une nouvelle transaction
  const handleAddTransaction = async (transactionData) => {
    try {
      await axios.post('/transactions', transactionData);
      await fetchData(); // Mise à jour immédiate du Dashboard
      setShowForm(false);
    } catch (error) {
      console.error("Erreur d'ajout:", error.response?.data);
      alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  // Mettre à jour une transaction existante
  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await axios.put(`/transactions/${id}`, transactionData);
      await fetchData();
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur de modification:", error.response?.data);
      alert("Erreur lors de la modification");
    }
  };

  // Supprimer une transaction
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await axios.delete(`/transactions/${id}`);
        await fetchData();
      } catch (error) {
        console.error("Erreur de suppression:", error.response?.data);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos finances...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💰 Finance Tracker</h1>
          <div className="user-info">
            <span>Bonjour, <strong>{user?.name}</strong></span>
            <button onClick={logout} className="btn-logout">Déconnexion</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Résumé des revenus, dépenses et solde */}
        <Summary summary={summary} />

        <div className="action-bar">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-add-transaction"
          >
            {showForm ? '✕ Fermer le formulaire' : '+ Nouvelle Transaction'}
          </button>
        </div>

        {/* Formulaire conditionnel pour Ajout ou Edition */}
        {showForm && (
          <TransactionForm
            onSubmit={
              editingTransaction
                ? (data) => handleUpdateTransaction(editingTransaction._id, data)
                : handleAddTransaction
            }
            onCancel={handleCloseForm}
            transaction={editingTransaction}
          />
        )}

        <div className="dashboard-grid">
          {/* Visualisation graphique */}
          <div className="chart-section">
             <Chart summary={summary} />
          </div>
          
          {/* Liste historique des transactions */}
          <div className="transactions-section">
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;