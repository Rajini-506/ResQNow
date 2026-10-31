import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify an emergency type'],
      enum: ['Medical', 'Accident', 'Fire', 'Personal Safety', 'Natural Disaster', 'Other'],
      default: 'Medical',
    },
    description: {
      type: String,
      default: 'Emergency SOS alert initiated by user.',
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude coordinate is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude coordinate is required'],
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'Emergency request created',
      enum: [
        'Emergency request created',
        'Active',
        'In Progress',
        'Resolved',
        'Cancelled',
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Emergency =
  mongoose.models.Emergency || mongoose.model('Emergency', emergencySchema);
export default Emergency;
