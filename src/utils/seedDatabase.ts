import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

dotenv.config();

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://mui.com/static/images/avatar/2.jpg',
  },
];

const generateSampleTransactions = (userId: any) => {
  const names = ['Matheus Ferreira', 'Floyd Miles', 'Jerome Bell', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson'];
  const emails = ['matheus@example.com', 'floyd@example.com', 'jerome@example.com', 'emily@example.com', 'michael@example.com', 'sarah@example.com'];
  const avatars = [
    'https://mui.com/static/images/avatar/1.jpg',
    'https://mui.com/static/images/avatar/2.jpg',
    'https://mui.com/static/images/avatar/3.jpg',
    'https://mui.com/static/images/avatar/4.jpg',
    'https://mui.com/static/images/avatar/5.jpg',
    'https://mui.com/static/images/avatar/6.jpg',
  ];

  const transactions = [];
  const currentDate = new Date();

  // Generate transactions for the last 6 months
  for (let i = 0; i < 50; i++) {
    const randomDays = Math.floor(Math.random() * 180); // 6 months
    const transactionDate = new Date(currentDate);
    transactionDate.setDate(transactionDate.getDate() - randomDays);

    const nameIndex = Math.floor(Math.random() * names.length);
    const isIncome = Math.random() > 0.4; // 60% income, 40% expense
    const amount = Math.floor(Math.random() * 1000) + 50; // $50 - $1050
    
    const categories = isIncome 
      ? ['revenue', 'investment', 'other']
      : ['expenses', 'transfer', 'other'];
    
    const statuses = ['completed', 'pending'];
    if (!isIncome) statuses.push('failed');

    transactions.push({
      user: userId,
      name: names[nameIndex],
      email: emails[nameIndex],
      avatar: avatars[nameIndex],
      date: transactionDate,
      amount,
      type: isIncome ? 'income' : 'expense',
      category: categories[Math.floor(Math.random() * categories.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `Sample ${isIncome ? 'income' : 'expense'} transaction`,
      reference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  }

  return transactions;
};

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-dashboard';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Create transactions for each user
    for (const user of createdUsers) {
      const transactions = generateSampleTransactions(user._id);
      await Transaction.insertMany(transactions);
      console.log(`Created ${transactions.length} transactions for ${user.email}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
