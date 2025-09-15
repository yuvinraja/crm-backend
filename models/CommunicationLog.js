const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED'],
      default: 'PENDING',
    },
    vendorResponse: {
      messageId: { type: String },
      timestamp: { type: Date },
      errorMessage: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
