const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    segmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stats: {
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      audienceSize: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Campaign', campaignSchema);
