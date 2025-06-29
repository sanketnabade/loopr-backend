import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
  exportTransactionsCSV,
} from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Dashboard stats
router.get('/stats', authenticate, getDashboardStats);

// CSV export
router.post('/export', authenticate, exportTransactionsCSV);

// CRUD operations
router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransaction);
router.post('/', authenticate, createTransaction);
router.put('/:id', authenticate, updateTransaction);
router.delete('/:id', authenticate, deleteTransaction);

export default router;
