import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    date: {
      type: String,
      required: [true, 'Please add a date'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
      match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'Please add an end time'],
      match: [/^\d{2}:\d{2}$/, 'End time must be in HH:mm format'],
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color'],
    },
    calendarId: {
      type: String,
      required: [true, 'Please add a calendar ID'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    repeatId: {
      type: String,
      default: null,
    },
    repeatEndDate: {
      type: String,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    exceptions: [
      {
        date: String,
        action: {
          type: String,
          enum: ['skip', 'modify'],
          default: 'skip',
        },
        modifiedEvent: {
          title: String,
          startTime: String,
          endTime: String,
          description: String,
        },
      },
    ],
    reminders: [
      {
        type: {
          type: String,
          enum: ['popup', 'email'],
          default: 'popup',
        },
        minutesBefore: {
          type: Number,
          min: 0,
        },
      },
    ],
    attendees: [
      {
        email: {
          type: String,
          match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
        },
        name: String,
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined', 'tentative'],
          default: 'pending',
        },
        isOrganizer: {
          type: Boolean,
          default: false,
        },
      },
    ],
    location: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['confirmed', 'tentative', 'cancelled'],
      default: 'confirmed',
    },
    url: String,
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.index({ calendarId: 1, date: 1 });
eventSchema.index({ owner: 1, date: 1 });
eventSchema.index({ repeatId: 1 });
eventSchema.index({ date: 1, startTime: 1, endTime: 1 });

eventSchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      return next(new Error('End time must be after start time'));
    }
  }
  next();
});

eventSchema.statics.findByCalendar = function (calendarId) {
  return this.find({ calendarId }).sort({ date: 1, startTime: 1 });
};

eventSchema.statics.findByDateRange = function (calendarId, startDate, endDate) {
  return this.find({
    calendarId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1, startTime: 1 });
};

eventSchema.statics.findByOwner = function (ownerId) {
  return this.find({ owner: ownerId }).sort({ date: 1, startTime: 1 });
};

eventSchema.methods.getDuration = function () {
  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  return endMinutes - startMinutes;
};

eventSchema.methods.isConflictWith = function (otherEvent) {
  if (this.date !== otherEvent.date) return false;

  const [thisStart] = this.startTime.split(':').map(Number);
  const [thisEnd] = this.endTime.split(':').map(Number);
  const [otherStart] = otherEvent.startTime.split(':').map(Number);
  const [otherEnd] = otherEvent.endTime.split(':').map(Number);

  const thisStartMin = thisStart * 60 + parseInt(this.startTime.split(':')[1]);
  const thisEndMin = thisEnd * 60 + parseInt(this.endTime.split(':')[1]);
  const otherStartMin = otherStart * 60 + parseInt(otherEvent.startTime.split(':')[1]);
  const otherEndMin = otherEnd * 60 + parseInt(otherEvent.endTime.split(':')[1]);

  return thisStartMin < otherEndMin && thisEndMin > otherStartMin;
};

export default mongoose.model('Event', eventSchema);
