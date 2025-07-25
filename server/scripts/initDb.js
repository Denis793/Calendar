import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Calendar from '../models/calendarModel.js';
import { connectDB } from '../utils/dbConnect.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeDefaultData = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: 'test@example.com' });

    if (!existingUser) {
      const defaultUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        isEmailVerified: true,
      });

      console.log('Default user created:', defaultUser.email);

      const defaultCalendar = await Calendar.create({
        id: 'default',
        name: 'Default Calendar',
        color: '#3b82f6',
        visible: false,
        isDefault: true,
        owner: defaultUser._id,
        description: 'Default calendar for personal events',
      });

      console.log('Default calendar created:', defaultCalendar.name);
    } else {
      console.log('ℹDefault user already exists');
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDefaultData();
