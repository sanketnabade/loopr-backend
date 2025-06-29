import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar?: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  category: 'revenue' | 'expenses' | 'investment' | 'transfer' | 'other';
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  name: {
    type: String,
    required: [true, 'Transaction name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Transaction type is required'],
  },
  category: {
    type: String,
    enum: ['revenue', 'expenses', 'investment', 'transfer', 'other'],
    required: [true, 'Category is required'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    required: [true, 'Status is required'],
    default: 'completed',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  reference: {
    type: String,
    trim: true,
    maxlength: [50, 'Reference cannot be more than 50 characters'],
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ amount: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
