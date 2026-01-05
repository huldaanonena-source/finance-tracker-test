const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// Toutes les routes sont protégées
router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/summary', getSummary);

router
  .route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
