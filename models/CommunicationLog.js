const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED'],
    default: 'PENDING',
  },
  vendorResponse: {
    messageId: String,
    timestamp: Date,
    errorMessage: String,
  },
  sentAt: Date,
  deliveredAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
