import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config({ path: '../.env' });

const verifyAndReset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    const user = await User.findOne({ email: 'shibukumar3935@gmail.com' }).select('+password');
    if (!user) {
      console.log('User shibukumar3935@gmail.com not found. Creating it.');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('1111Shibu', salt);
      await User.collection.insertOne({
        name: 'shibu kumar',
        email: 'shibukumar3935@gmail.com',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Successfully created user with password 1111Shibu.');
      process.exit(0);
    }

    const isMatch = await bcrypt.compare('1111Shibu', user.password);
    if (isMatch) {
      console.log('Password 1111Shibu already matches in database!');
    } else {
      console.log('Password mismatch. Resetting to 1111Shibu...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('1111Shibu', salt);
      user.password = hashedPassword;
      await user.save();
      console.log('Successfully updated password to 1111Shibu.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

verifyAndReset();
