import { Response } from 'express';
import { Transaction, ITransaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { Parser } from 'json2csv';

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
  type?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const {
      page = '1',
      limit = '10',
      search,
      type,
      category,
      status,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query as QueryParams;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = { user: req.user._id };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [transactions, totalCount] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email avatar'),
      Transaction.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      transactions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: 'An error occurred while fetching transactions',
    });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    }).populate('user', 'name email avatar');

    if (!transaction) {
      res.status(404).json({
        error: 'Transaction not found',
        message: 'Transaction does not exist or you do not have permission to view it',
      });
      return;
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction',
      message: 'An error occurred while fetching the transaction',
    });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const {
      name,
      email,
      avatar,
      date,
      amount,
      type,
      category,
      status = 'completed',
      description,
      reference,
    } = req.body;

    // Validation
    if (!name || !email || !amount || !type || !category) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Name, email, amount, type, and category are required',
      });
      return;
    }

    const transaction = new Transaction({
      user: req.user._id,
      name,
      email,
      avatar,
      date: date ? new Date(date) : new Date(),
      amount,
      type,
      category,
      status,
      description,
      reference,
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      error: 'Failed to create transaction',
      message: 'An error occurred while creating the transaction',
    });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    if (!transaction) {
      res.status(404).json({
        error: 'Transaction not found',
        message: 'Transaction does not exist or you do not have permission to update it',
      });
      return;
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      error: 'Failed to update transaction',
      message: 'An error occurred while updating the transaction',
    });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      res.status(404).json({
        error: 'Transaction not found',
        message: 'Transaction does not exist or you do not have permission to delete it',
      });
      return;
    }

    res.json({
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      error: 'Failed to delete transaction',
      message: 'An error occurred while deleting the transaction',
    });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const userId = req.user._id;

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Get overall stats
    const [totalIncome, totalExpenses, monthlyIncome, monthlyExpenses, recentTransactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'income', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.find({ user: userId })
        .sort({ date: -1 })
        .limit(5)
        .populate('user', 'name email avatar'),
    ]);

    // Get monthly trends (last 12 months)
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: new Date(currentYear - 1, currentMonth, 1) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0,
      monthlyExpenses: monthlyExpenses[0]?.total || 0,
      balance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      monthlyBalance: (monthlyIncome[0]?.total || 0) - (monthlyExpenses[0]?.total || 0),
      recentTransactions,
      monthlyTrends,
      categoryBreakdown,
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      message: 'An error occurred while fetching dashboard statistics',
    });
  }
};

export const exportTransactionsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    const { columns, startDate, endDate, type, category, status } = req.body;

    // Build filter
    const filter: any = { user: req.user._id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Get transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('user', 'name email avatar');

    // Define available fields
    const availableFields = [
      'name',
      'email',
      'date',
      'amount',
      'type',
      'category',
      'status',
      'description',
      'reference',
    ];

    // Use specified columns or default fields
    const fieldsToExport = columns && columns.length > 0 ? columns : availableFields;

    // Transform data for CSV
    const csvData = transactions.map((transaction) => {
      const data: any = {};
      fieldsToExport.forEach((field: string) => {
        switch (field) {
          case 'date':
            data[field] = transaction.date.toISOString().split('T')[0];
            break;
          case 'amount':
            data[field] = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
            break;
          default:
            data[field] = transaction[field as keyof ITransaction] || '';
        }
      });
      return data;
    });

    // Generate CSV
    const parser = new Parser({ fields: fieldsToExport });
    const csv = parser.parse(csvData);

    // Set response headers
    const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      error: 'Failed to export transactions',
      message: 'An error occurred while exporting transactions to CSV',
    });
  }
};
