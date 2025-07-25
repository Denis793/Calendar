import mongoose from 'mongoose';
import Calendar from '../models/calendarModel.js';
import Event from '../models/eventModel.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

export const getCalendars = asyncHandler(async (req, res, next) => {
  let calendars = [];

  if (req.user && req.user.id !== 'anonymous') {
    const ownedCalendars = await Calendar.findByOwner(req.user.id).populate('sharedWith.user', 'name email');

    const sharedCalendars = await Calendar.findSharedWithUser(req.user.id);
    calendars = [...ownedCalendars, ...sharedCalendars];
  } else {
    calendars = await Calendar.find({});
  }

  const formattedCalendars = calendars.map((calendar) => ({
    id: calendar.id,
    name: calendar.name,
    color: calendar.color,
    visible: calendar.visible,
    isDefault: calendar.isDefault,
    description: calendar.description,
    isOwned: !req.user || req.user.id === 'anonymous' || calendar.owner.toString() === req.user.id,
    settings: calendar.settings,
    sharedWith: calendar.sharedWith || [],
    createdAt: calendar.createdAt,
    updatedAt: calendar.updatedAt,
  }));

  res.status(200).json({
    success: true,
    count: formattedCalendars.length,
    data: formattedCalendars,
  });
});

export const getCalendar = asyncHandler(async (req, res, next) => {
  const calendar = await Calendar.findOne({ id: req.params.id }).populate('sharedWith.user', 'name email');

  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (calendar.owner.toString() !== req.user.id && !calendar.isSharedWithUser(req.user.id)) {
      return next(new AppError('Not authorized to access this calendar', 403));
    }
  }

  res.status(200).json({
    success: true,
    data: {
      id: calendar.id,
      name: calendar.name,
      color: calendar.color,
      visible: calendar.visible,
      isDefault: calendar.isDefault,
      description: calendar.description,
      isOwned: calendar.owner.toString() === req.user.id,
      settings: calendar.settings,
      sharedWith: calendar.sharedWith || [],
      createdAt: calendar.createdAt,
      updatedAt: calendar.updatedAt,
    },
  });
});

export const createCalendar = asyncHandler(async (req, res, next) => {
  const { id, name, color, description, visible = false, settings } = req.body;

  if (!id || !name || !color) {
    return next(new AppError('Please provide id, name and color', 400));
  }

  let ownerId = req.user.id;
  if (req.user.id === 'anonymous') {
    ownerId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
  }

  const existingCalendar = await Calendar.findOne({ id });
  if (existingCalendar) {
    return next(new AppError('Calendar with this ID already exists', 400));
  }

  const calendar = await Calendar.create({
    id,
    name,
    color,
    description,
    visible,
    owner: ownerId,
    settings: settings || {},
  });

  res.status(201).json({
    success: true,
    data: {
      id: calendar.id,
      name: calendar.name,
      color: calendar.color,
      visible: calendar.visible,
      isDefault: calendar.isDefault,
      description: calendar.description,
      isOwned: true,
      settings: calendar.settings,
      sharedWith: calendar.sharedWith || [],
      createdAt: calendar.createdAt,
      updatedAt: calendar.updatedAt,
    },
  });
});

export const updateCalendar = asyncHandler(async (req, res, next) => {
  let calendar = await Calendar.findOne({ id: req.params.id });

  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (calendar.owner.toString() !== req.user.id) {
      const userPermission = calendar.getUserPermission(req.user.id);
      if (userPermission !== 'write') {
        return next(new AppError('Not authorized to edit this calendar', 403));
      }
    }
  }

  const updatedFields = {
    name: req.body.name,
    color: req.body.color,
    description: req.body.description,
    visible: req.body.visible,
    settings: req.body.settings,
  };

  Object.keys(updatedFields).forEach((key) => {
    if (updatedFields[key] === undefined) {
      delete updatedFields[key];
    }
  });

  calendar = await Calendar.findOneAndUpdate({ id: req.params.id }, updatedFields, {
    new: true,
    runValidators: true,
  }).populate('sharedWith.user', 'name email');

  res.status(200).json({
    success: true,
    data: {
      id: calendar.id,
      name: calendar.name,
      color: calendar.color,
      visible: calendar.visible,
      isDefault: calendar.isDefault,
      description: calendar.description,
      isOwned: calendar.owner.toString() === req.user.id,
      settings: calendar.settings,
      sharedWith: calendar.sharedWith || [],
      createdAt: calendar.createdAt,
      updatedAt: calendar.updatedAt,
    },
  });
});

export const deleteCalendar = asyncHandler(async (req, res, next) => {
  const calendar = await Calendar.findOne({ id: req.params.id });

  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (calendar.owner.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this calendar', 403));
    }
  }

  if (calendar.isDefault) {
    return next(new AppError('Cannot delete default calendar', 400));
  }

  await Event.deleteMany({ calendarId: calendar.id });
  await Calendar.deleteOne({ id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Calendar deleted successfully',
  });
});

export const toggleVisibility = asyncHandler(async (req, res, next) => {
  const calendar = await Calendar.findOne({ id: req.params.id });

  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (calendar.owner.toString() !== req.user.id && !calendar.isSharedWithUser(req.user.id)) {
    return next(new AppError('Not authorized to access this calendar', 403));
  }

  calendar.visible = !calendar.visible;
  await calendar.save();

  res.status(200).json({
    success: true,
    data: {
      id: calendar.id,
      visible: calendar.visible,
    },
  });
});

export const shareCalendar = asyncHandler(async (req, res, next) => {
  const { email, permission = 'read' } = req.body;

  if (!email) {
    return next(new AppError('Please provide email address', 400));
  }

  const calendar = await Calendar.findOne({ id: req.params.id });

  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (calendar.owner.toString() !== req.user.id) {
    return next(new AppError('Only calendar owner can share calendar', 403));
  }

  const User = (await import('../models/userModel.js')).default;
  const userToShare = await User.findOne({ email });

  if (!userToShare) {
    return next(new AppError('User not found', 404));
  }

  const existingShare = calendar.sharedWith.find((share) => share.user.toString() === userToShare._id.toString());

  if (existingShare) {
    return next(new AppError('Calendar already shared with this user', 400));
  }

  calendar.sharedWith.push({
    user: userToShare._id,
    permission,
    addedAt: new Date(),
  });

  await calendar.save();

  res.status(200).json({
    success: true,
    message: 'Calendar shared successfully',
  });
});

export const createDefaultCalendar = asyncHandler(async (req, res, next) => {
  let ownerId = req.user.id;
  if (req.user.id === 'anonymous') {
    ownerId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
  }

  const existingDefault = await Calendar.findOne({
    owner: ownerId,
    isDefault: true,
  });

  if (existingDefault) {
    return res.status(200).json({
      success: true,
      data: {
        id: existingDefault.id,
        name: existingDefault.name,
        color: existingDefault.color,
        visible: existingDefault.visible,
        isDefault: existingDefault.isDefault,
        description: existingDefault.description,
        isOwned: true,
        settings: existingDefault.settings,
        sharedWith: existingDefault.sharedWith || [],
        createdAt: existingDefault.createdAt,
        updatedAt: existingDefault.updatedAt,
      },
    });
  }

  const defaultCalendar = await Calendar.create({
    id: `default-${Date.now()}`,
    name: 'Default Calendar',
    color: '#3B82F6',
    description: 'Main calendar',
    visible: false,
    isDefault: true,
    owner: ownerId,
    settings: {},
  });

  res.status(201).json({
    success: true,
    data: {
      id: defaultCalendar.id,
      name: defaultCalendar.name,
      color: defaultCalendar.color,
      visible: defaultCalendar.visible,
      isDefault: defaultCalendar.isDefault,
      description: defaultCalendar.description,
      isOwned: true,
      settings: defaultCalendar.settings,
      sharedWith: defaultCalendar.sharedWith || [],
      createdAt: defaultCalendar.createdAt,
      updatedAt: defaultCalendar.updatedAt,
    },
  });
});
