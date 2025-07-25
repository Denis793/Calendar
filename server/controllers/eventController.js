import mongoose from 'mongoose';
import Event from '../models/eventModel.js';
import Calendar from '../models/calendarModel.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';

const normalizeDate = (dateInput) => {
  if (!dateInput) return dateInput;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }

  try {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error normalizing date:', error);
    return dateInput;
  }
};

export const getEvents = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, calendarId } = req.query;

  let events = [];

  if (req.user && req.user.id !== 'anonymous') {
    const ownedCalendars = await Calendar.findByOwner(req.user.id);
    const sharedCalendars = await Calendar.findSharedWithUser(req.user.id);
    const allCalendars = [...ownedCalendars, ...sharedCalendars];
    const calendarIds = allCalendars.map((cal) => cal.id);

    let query = {
      calendarId: { $in: calendarIds },
    };

    if (calendarId) {
      query.calendarId = calendarId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    events = await Event.find(query).sort({ date: 1, startTime: 1 });
  } else {
    let query = {};

    if (calendarId) {
      query.calendarId = calendarId;
    }
    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    events = await Event.find(query).sort({ date: 1, startTime: 1 });
  }

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    allDay: event.allDay,
    color: event.color,
    calendarId: event.calendarId,
    repeat: event.repeat,
    repeatId: event.repeatId,
    repeatEndDate: event.repeatEndDate,
    reminders: event.reminders,
    location: event.location,
    attendees: event.attendees,
    isPrivate: event.isPrivate,
    status: event.status,
    url: event.url,
    attachments: event.attachments,
    isOwned: event.owner.toString() === req.user.id,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));

  res.status(200).json({
    success: true,
    count: formattedEvents.length,
    data: formattedEvents,
  });
});

export const getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({ id: req.params.id });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const calendar = await Calendar.findOne({ id: event.calendarId });
  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (calendar.owner.toString() !== req.user.id && !calendar.isSharedWithUser(req.user.id)) {
    return next(new AppError('Not authorized to access this event', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      color: event.color,
      calendarId: event.calendarId,
      repeat: event.repeat,
      repeatId: event.repeatId,
      repeatEndDate: event.repeatEndDate,
      reminders: event.reminders,
      location: event.location,
      attendees: event.attendees,
      isPrivate: event.isPrivate,
      status: event.status,
      url: event.url,
      attachments: event.attachments,
      isOwned: event.owner.toString() === req.user.id,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    },
  });
});

export const createEvent = asyncHandler(async (req, res, next) => {
  const {
    id,
    title,
    description,
    date,
    startTime,
    endTime,
    allDay,
    color,
    calendarId,
    repeat,
    repeatEndDate,
    reminders,
    location,
    attendees,
    isPrivate,
    url,
    attachments,
  } = req.body;

  if (!id || !title || !date || !startTime || !endTime || !calendarId) {
    return next(new AppError('Please provide id, title, date, startTime, endTime and calendarId', 400));
  }

  let ownerId = req.user.id;
  if (req.user.id === 'anonymous') {
    ownerId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');
  }

  const calendar = await Calendar.findOne({ id: calendarId });
  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (calendar.owner.toString() !== req.user.id) {
      const userPermission = calendar.getUserPermission(req.user.id);
      if (userPermission !== 'write') {
        return next(new AppError('Not authorized to create events in this calendar', 403));
      }
    }
  }

  const existingEvent = await Event.findOne({ id });
  if (existingEvent) {
    return next(new AppError('Event with this ID already exists', 400));
  }

  const event = await Event.create({
    id,
    title,
    description,
    date: normalizeDate(date),
    startTime,
    endTime,
    allDay: allDay || false,
    color,
    calendarId,
    owner: ownerId,
    repeat: repeat || 'none',
    repeatEndDate,
    reminders: reminders || [],
    location,
    attendees: attendees || [],
    isPrivate: isPrivate || false,
    url,
    attachments: attachments || [],
  });

  res.status(201).json({
    success: true,
    data: {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      color: event.color,
      calendarId: event.calendarId,
      repeat: event.repeat,
      repeatId: event.repeatId,
      repeatEndDate: event.repeatEndDate,
      reminders: event.reminders,
      location: event.location,
      attendees: event.attendees,
      isPrivate: event.isPrivate,
      status: event.status,
      url: event.url,
      attachments: event.attachments,
      isOwned: true,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    },
  });
});

export const updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findOne({ id: req.params.id });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const calendar = await Calendar.findOne({ id: event.calendarId });
  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (calendar.owner.toString() !== req.user.id) {
      const userPermission = calendar.getUserPermission(req.user.id);
      if (userPermission !== 'write') {
        return next(new AppError('Not authorized to edit this event', 403));
      }
    }
  }

  const updatedFields = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date ? normalizeDate(req.body.date) : undefined,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    allDay: req.body.allDay,
    color: req.body.color,
    repeat: req.body.repeat,
    repeatEndDate: req.body.repeatEndDate,
    reminders: req.body.reminders,
    location: req.body.location,
    attendees: req.body.attendees,
    isPrivate: req.body.isPrivate,
    status: req.body.status,
    url: req.body.url,
    attachments: req.body.attachments,
  };

  Object.keys(updatedFields).forEach((key) => {
    if (updatedFields[key] === undefined) {
      delete updatedFields[key];
    }
  });

  event = await Event.findOneAndUpdate({ id: req.params.id }, updatedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      color: event.color,
      calendarId: event.calendarId,
      repeat: event.repeat,
      repeatId: event.repeatId,
      repeatEndDate: event.repeatEndDate,
      reminders: event.reminders,
      location: event.location,
      attendees: event.attendees,
      isPrivate: event.isPrivate,
      status: event.status,
      url: event.url,
      attachments: event.attachments,
      isOwned: event.owner.toString() === req.user.id,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    },
  });
});

export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findOne({ id: req.params.id });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const calendar = await Calendar.findOne({ id: event.calendarId });
  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (calendar.owner.toString() !== req.user.id) {
      const userPermission = calendar.getUserPermission(req.user.id);
      if (userPermission !== 'write') {
        return next(new AppError('Not authorized to delete this event', 403));
      }
    }
  }

  await Event.deleteOne({ id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});

export const moveEvent = asyncHandler(async (req, res, next) => {
  const { newCalendarId } = req.body;

  if (!newCalendarId) {
    return next(new AppError('Please provide new calendar ID', 400));
  }

  const event = await Event.findOne({ id: req.params.id });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const currentCalendar = await Calendar.findOne({ id: event.calendarId });
  if (!currentCalendar) {
    return next(new AppError('Current calendar not found', 404));
  }

  const newCalendar = await Calendar.findOne({ id: newCalendarId });
  if (!newCalendar) {
    return next(new AppError('New calendar not found', 404));
  }

  if (req.user.id !== 'anonymous') {
    if (currentCalendar.owner.toString() !== req.user.id || newCalendar.owner.toString() !== req.user.id) {
      return next(new AppError('Not authorized to move this event', 403));
    }
  }

  event.calendarId = newCalendarId;
  await event.save();

  res.status(200).json({
    success: true,
    data: {
      id: event.id,
      calendarId: event.calendarId,
    },
  });
});

export const duplicateEvent = asyncHandler(async (req, res, next) => {
  const { newId, newCalendarId } = req.body;

  if (!newId) {
    return next(new AppError('Please provide new event ID', 400));
  }

  const event = await Event.findOne({ id: req.params.id });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const existingEvent = await Event.findOne({ id: newId });
  if (existingEvent) {
    return next(new AppError('Event with this ID already exists', 400));
  }

  const calendar = await Calendar.findOne({ id: event.calendarId });
  if (!calendar) {
    return next(new AppError('Calendar not found', 404));
  }

  if (calendar.owner.toString() !== req.user.id && !calendar.isSharedWithUser(req.user.id)) {
    return next(new AppError('Not authorized to access this event', 403));
  }

  const duplicatedEvent = await Event.create({
    ...event.toObject(),
    _id: undefined,
    id: newId,
    title: `${event.title} (Copy)`,
    calendarId: newCalendarId || event.calendarId,
    owner: req.user.id,
    createdAt: undefined,
    updatedAt: undefined,
  });

  res.status(201).json({
    success: true,
    data: {
      id: duplicatedEvent.id,
      title: duplicatedEvent.title,
      description: duplicatedEvent.description,
      date: duplicatedEvent.date,
      startTime: duplicatedEvent.startTime,
      endTime: duplicatedEvent.endTime,
      allDay: duplicatedEvent.allDay,
      color: duplicatedEvent.color,
      calendarId: duplicatedEvent.calendarId,
      repeat: duplicatedEvent.repeat,
      isOwned: true,
      createdAt: duplicatedEvent.createdAt,
      updatedAt: duplicatedEvent.updatedAt,
    },
  });
});
