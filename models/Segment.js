const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    rules: [
      {
        field: {
          type: String,
          required: true,
        },
        operator: {
          type: String,
          required: true,
          enum: [
            '>',
            '>=',
            '<=',
            '<',
            '=',
            '!=',
            'contains',
            'startsWith',
            'endsWith',
            'in_last_days',
          ],
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
        },
        logicalOperator: {
          type: String,
          enum: ['AND', 'OR'],
          default: 'AND',
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audienceSize: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Segment', segmentSchema);
