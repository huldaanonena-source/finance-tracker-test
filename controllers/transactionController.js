const Transaction = require('../models/Transaction');

// @desc    Obtenir toutes les transactions de l'utilisateur
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une nouvelle transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Modifier une transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Transaction non trouvée' });
    }

    // Vérifier que la transaction appartient à l'utilisateur
    if (
      transaction.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const updatedTransaction =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer une transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Transaction non trouvée' });
    }

    // Vérifier que la transaction appartient à l'utilisateur
    if (
      transaction.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir le résumé des finances
// @route   GET /api/transactions/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const expensesByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] =
          (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    res.json({
      totalIncome,
      totalExpense,
      balance,
      expensesByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
