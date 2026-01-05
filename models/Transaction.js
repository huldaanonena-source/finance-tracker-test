const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Le type est requis']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: [
      'Salary', 'Freelance', 'Investment', 'Other Income',
      'Food', 'Rent', 'Transport', 'Entertainment',
      'Health', 'Shopping', 'Bills', 'Other Expense'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant doit être positif']
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
