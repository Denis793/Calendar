import mongoose from 'mongoose';
import process from 'process';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar_app';
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('🔗 URI provided:', mongoURI ? 'Yes' : 'No');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionRetryCount: 5, // Retry 5 times
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('❌ Error details:', error);
    console.error('❌ MongoDB URI provided:', process.env.MONGODB_URI ? 'Yes' : 'No');
    
    // In production, still try to continue without crashing
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      console.error('🚨 Production mode: continuing without database');
    }
  }
};

export const getConnectionStatus = () => {
  return mongoose.connection.readyState;
};

// Connection statuses:
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
