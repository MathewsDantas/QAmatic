import mongoose from 'mongoose';

const analysisLogSchema = new mongoose.Schema(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
      index: true,
    },
    testCaseId: {
      type: Number,
      required: true,
    },
    testCaseName: {
      type: String,
      required: true,
    },
    stepOrder: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    selector: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['passed', 'failed', 'skipped'],
      required: true,
    },
    error: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    screenshot: {
      type: String,
      default: null,
    },
    pageUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AnalysisLog', analysisLogSchema);
