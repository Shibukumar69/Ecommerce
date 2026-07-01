import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config({ path: '../.env' });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected for user seeding.');

    // Remove existing test accounts if any to avoid duplication
    await User.deleteOne({ email: 'admin@gmail.com' });
    await User.deleteOne({ email: 'customer@gmail.com' });

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    // Bypass pre-save since we already hashed
    await User.collection.insertOne({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: admin.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Seeded Admin account: admin@gmail.com (password: password123)');

    // Create Customer
    const customer = new User({
      name: 'Customer User',
      email: 'customer@gmail.com',
      password: hashedPassword,
      role: 'user'
    });
    await User.collection.insertOne({
      name: customer.name,
      email: customer.email,
      password: customer.password,
      role: customer.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Seeded Customer account: customer@gmail.com (password: password123)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
