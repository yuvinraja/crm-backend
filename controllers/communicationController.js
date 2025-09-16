const CommunicationLog = require('../models/CommunicationLog');
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

const communicationController = {
  // Handle delivery receipt webhook
  async handleDeliveryReceipt(req, res) {
    try {
      const {
        messageId,
        campaignId,
        customerId,
        status,
        timestamp,
        errorMessage,
      } = req.body;

      // Update log
      const log = await CommunicationLog.findOneAndUpdate(
        { campaignId, customerId },
        {
          deliveryStatus: status,
          vendorResponse: {
            messageId,
            timestamp: new Date(timestamp),
            errorMessage,
          },
        },
        { new: true }
      );

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Communication log not found',
        });
      }

      // Update campaign stats
      const inc =
        status === 'SENT' ? { 'stats.sent': 1 } : { 'stats.failed': 1 };
      await Campaign.findByIdAndUpdate(campaignId, { $inc: inc });

      res.json({
        success: true,
        message: 'Delivery receipt processed successfully',
      });
    } catch (error) {
      console.error('Delivery receipt error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process delivery receipt',
        error: error.message,
      });
    }
  },

  // Get communication logs
  async getCommunicationLogs(req, res) {
    try {
      const { page = 1, limit = 20, campaignId, status } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (campaignId) filter.campaignId = campaignId;
      if (status) filter.deliveryStatus = status;

      const logs = await CommunicationLog.find(filter)
        .populate('campaignId', 'name message')
        .populate('customerId', 'name email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await CommunicationLog.countDocuments(filter);

      res.json({
        success: true,
        data: logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: skip + logs.length < total,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch communication logs',
        error: error.message,
      });
    }
  },

  // Get communication log by ID
  async getCommunicationLogById(req, res) {
    try {
      const log = await CommunicationLog.findById(req.params.id)
        .populate('campaignId', 'name message')
        .populate('customerId', 'name email phone');

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Communication log not found',
        });
      }

      res.json({
        success: true,
        data: log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch communication log',
        error: error.message,
      });
    }
  },

  // Get communication logs by campaign
  async getLogsByCampaign(req, res) {
    try {
      const { campaignId } = req.params;
      const { status } = req.query;

      const filter = { campaignId: new mongoose.Types.ObjectId(campaignId) };
      if (status) filter.deliveryStatus = status;

      const logs = await CommunicationLog.find(filter)
        .populate('customerId', 'name email phone')
        .sort({ createdAt: -1 });

      // Aggregate stats
      const stats = await CommunicationLog.aggregate([
        { $match: { campaignId: new mongoose.Types.ObjectId(campaignId) } },
        { $group: { _id: '$deliveryStatus', count: { $sum: 1 } } },
      ]);

      const statsFormatted = { total: 0, sent: 0, failed: 0, pending: 0 };
      stats.forEach((s) => {
        statsFormatted.total += s.count;
        statsFormatted[s._id.toLowerCase()] = s.count;
      });

      res.json({
        success: true,
        data: { logs, stats: statsFormatted },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign logs',
        error: error.message,
      });
    }
  },

  // Update delivery status manually
  async updateDeliveryStatus(req, res) {
    try {
      const { status, errorMessage } = req.body;

      const log = await CommunicationLog.findByIdAndUpdate(
        req.params.id,
        {
          deliveryStatus: status,
          ...(errorMessage && {
            'vendorResponse.errorMessage': errorMessage,
            'vendorResponse.timestamp': new Date(),
          }),
        },
        { new: true }
      )
        .populate('campaignId', 'name message')
        .populate('customerId', 'name email');

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Communication log not found',
        });
      }

      res.json({
        success: true,
        message: 'Delivery status updated successfully',
        data: log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update delivery status',
        error: error.message,
      });
    }
  },
};

module.exports = communicationController;
