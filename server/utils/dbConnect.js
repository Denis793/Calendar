import mongoose from 'mongoose';
import process from 'process';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar_app';

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
    console.error('❌ MongoDB URI format:', process.env.MONGODB_URI ? 'URI provided' : 'Using default URI');
    
    // Don't exit in production, let the app continue
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
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
