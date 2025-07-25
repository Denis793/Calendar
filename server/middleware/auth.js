import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      req.user = await User.findById(decoded.id);

      if (!req.user) {
        console.warn('Token provided but user not found');
      }
    } catch (err) {
      console.warn('Invalid token provided:', err.message);
    }
  }

  if (!req.user) {
    req.user = {
      id: 'anonymous',
      _id: 'anonymous',
      name: 'Anonymous User',
      email: 'anonymous@localhost',
    };
  }

  next();
});

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new AppError('No user found with this id', 404));
    }

    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};
