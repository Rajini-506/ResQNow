import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: [true, 'Incident type is required'],
      enum: ['Accident', 'Medical', 'Fire', 'Hazard', 'Personal Safety', 'Other'],
      default: 'Accident',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    aiClassification: {
      category: { type: String, default: 'General' },
      urgency: { type: String, default: 'Medium' },
      summary: { type: String, default: '' },
      recommendedAction: { type: String, default: '' },
      immediateChecklist: [{ type: String }],
    },
    status: {
      type: String,
      default: 'Submitted',
      enum: ['Submitted', 'Under Review', 'Verified', 'Closed'],
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

export const Incident =
  mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
export default Incident;
