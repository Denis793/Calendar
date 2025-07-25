import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';
import { connectDB } from './utils/dbConnect.js';
import { errorHandler } from './utils/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

// Configure Helmet with proper CSP for production
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        styleElem: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);
app.use(compression());
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? true // Allow same origin in production
        : process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection check middleware
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ Database not connected, readyState:', mongoose.connection.readyState);
    return res.status(503).json({
      success: false,
      error: 'Database not available',
      message: 'Database connection is not ready',
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText =
    {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }[dbStatus] || 'unknown';

  const healthData = {
    status: 'OK',
    message: 'Calendar API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    database: {
      status: dbStatusText,
      readyState: dbStatus,
      connected: dbStatus === 1,
      host: mongoose.connection.host || 'not connected',
      name: mongoose.connection.name || 'not connected',
    },
    env: {
      mongoUriProvided: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
    },
  };

  // If database is not connected, return 503
  if (dbStatus !== 1) {
    return res.status(503).json({
      ...healthData,
      status: 'Service Unavailable',
      message: 'Database is not connected',
    });
  }

  res.status(200).json(healthData);
});

// Debug endpoints
app.get('/api/debug/calendars', async (req, res) => {
  try {
    const Calendar = (await import('./models/calendarModel.js')).default;
    const calendars = await Calendar.find({});
    res.status(200).json({
      success: true,
      count: calendars.length,
      data: calendars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/debug/events', async (req, res) => {
  try {
    const Event = (await import('./models/eventModel.js')).default;
    const events = await Event.find({});
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(join(__dirname, '..', 'dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
} else {
  // 404 handler for development
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
}

// Error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

export default app;
