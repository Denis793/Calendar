import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a calendar name'],
      trim: true,
      maxlength: [100, 'Calendar name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    color: {
      type: String,
      required: [true, 'Please add a color'],
      match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color'],
    },
    visible: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        permission: {
          type: String,
          enum: ['read', 'write'],
          default: 'read',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      allowEventCreation: {
        type: Boolean,
        default: true,
      },
      eventDefaultDuration: {
        type: Number,
        default: 60,
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

calendarSchema.index({ owner: 1, isArchived: 1 });
calendarSchema.index({ id: 1 }, { unique: true });
calendarSchema.index({ 'sharedWith.user': 1 });

calendarSchema.virtual('events', {
  ref: 'Event',
  localField: 'id',
  foreignField: 'calendarId',
  justOne: false,
});

calendarSchema.pre('remove', async function (next) {
  await this.model('Event').deleteMany({ calendarId: this.id });
  next();
});

calendarSchema.statics.findByOwner = function (ownerId, includeArchived = false) {
  const query = { owner: ownerId };
  if (!includeArchived) {
    query.isArchived = false;
  }
  return this.find(query).sort({ createdAt: -1 });
};

calendarSchema.statics.findSharedWithUser = function (userId) {
  return this.find({
    'sharedWith.user': userId,
    isArchived: false,
  }).populate('owner', 'name email');
};

calendarSchema.methods.isSharedWithUser = function (userId) {
  return this.sharedWith.some((share) => share.user.toString() === userId.toString());
};

calendarSchema.methods.getUserPermission = function (userId) {
  const share = this.sharedWith.find((share) => share.user.toString() === userId.toString());
  return share ? share.permission : null;
};

export default mongoose.model('Calendar', calendarSchema);
