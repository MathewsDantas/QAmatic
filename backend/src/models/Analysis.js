import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'error'],
      default: 'pending',
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Analysis', analysisSchema);
