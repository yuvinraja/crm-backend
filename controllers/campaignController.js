const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const axios = require('axios');

const campaignController = {
  // Dummy Vendor API simulation
  async sendToVendorAPI(customer, message, campaignId) {
    try {
      // Simulate 90% success rate
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        // Simulate successful delivery
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Simulate async webhook callback to delivery receipt API
        setTimeout(
          async () => {
            try {
              await axios.post(
                `${process.env.BASE_URL || 'http://localhost:3000'}/api/communications/delivery-receipt`,
                {
                  messageId,
                  campaignId,
                  customerId: customer._id,
                  status: 'SENT',
                  timestamp: new Date().toISOString(),
                }
              );
            } catch (error) {
              console.error('Failed to send delivery receipt:', error.message);
            }
          },
          Math.random() * 5000 + 1000
        ); // Random delay 1-6 seconds

        return { success: true, messageId };
      } else {
        // Simulate failure
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        setTimeout(
          async () => {
            try {
              await axios.post(
                `${process.env.BASE_URL || 'http://localhost:3000'}/api/communications/delivery-receipt`,
                {
                  messageId,
                  campaignId,
                  customerId: customer._id,
                  status: 'FAILED',
                  timestamp: new Date().toISOString(),
                  errorMessage: 'Simulated delivery failure',
                }
              );
            } catch (error) {
              console.error('Failed to send delivery receipt:', error.message);
            }
          },
          Math.random() * 3000 + 500
        );

        return {
          success: false,
          messageId,
          error: 'Simulated delivery failure',
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create campaign and initiate delivery
  async createCampaign(req, res) {
    try {
      const campaignData = {
        ...req.body,
        createdBy: req.user._id,
      };

      const campaign = await Campaign.create(campaignData);

      // Get segment and its customers
      const segment = await Segment.findById(req.body.segmentId);
      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      // Build query from segment conditions
      const segmentController = require('./segmentController');
      const query = segmentController.buildSegmentQuery(
        segment.conditions,
        segment.logic
      );
      const customers = await Customer.find(query);

      // Create communication logs for each customer
      const communicationLogs = customers.map((customer) => ({
        campaignId: campaign._id,
        customerId: customer._id,
        deliveryStatus: 'PENDING',
      }));

      await CommunicationLog.insertMany(communicationLogs);

      // Start delivery process asynchronously
      setImmediate(() => {
        campaignController.initiateDelivery(
          campaign,
          customers,
          req.body.message
        );
      });

      const populatedCampaign = await Campaign.findById(campaign._id)
        .populate('segmentId', 'name audienceSize')
        .populate('createdBy', 'name email');

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully and delivery initiated',
        data: populatedCampaign,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create campaign',
        error: error.message,
      });
    }
  },

  // Initiate delivery process
  async initiateDelivery(campaign, customers, messageTemplate) {
    try {
      const deliveryPromises = customers.map(async (customer) => {
        try {
          // Personalize message
          const personalizedMessage = messageTemplate.replace(
            /\{name\}/gi,
            customer.name
          );

          // Send to vendor API
          await campaignController.sendToVendorAPI(
            customer,
            personalizedMessage,
            campaign._id
          );
        } catch (error) {
          console.error(
            `Failed to send message to customer ${customer._id}:`,
            error.message
          );
        }
      });

      await Promise.allSettled(deliveryPromises);
    } catch (error) {
      console.error('Failed to initiate delivery:', error.message);
    }
  },

  // Get all campaigns for user
  async getAllCampaigns(req, res) {
    try {
      const campaigns = await Campaign.find({ createdBy: req.user._id })
        .populate('segmentId', 'name audienceSize')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: campaigns,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaigns',
        error: error.message,
      });
    }
  },

  // Get campaign by ID
  async getCampaignById(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id)
        .populate('segmentId', 'name audienceSize conditions logic')
        .populate('createdBy', 'name email');

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
      }

      // Get delivery stats
      const stats = await campaignController.getCampaignStatsHelper(
        campaign._id
      );

      res.json({
        success: true,
        data: {
          ...campaign.toObject(),
          stats,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign',
        error: error.message,
      });
    }
  },

  // Update campaign
  async updateCampaign(req, res) {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate('segmentId', 'name audienceSize')
        .populate('createdBy', 'name email');

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
      }

      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update campaign',
        error: error.message,
      });
    }
  },

  // Delete campaign
  async deleteCampaign(req, res) {
    try {
      const campaign = await Campaign.findByIdAndDelete(req.params.id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
      }

      // Delete related communication logs
      await CommunicationLog.deleteMany({ campaignId: req.params.id });

      res.json({
        success: true,
        message: 'Campaign deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete campaign',
        error: error.message,
      });
    }
  },

  // Helper function to get campaign stats
  async getCampaignStatsHelper(campaignId) {
    const stats = await CommunicationLog.aggregate([
      { $match: { campaignId: campaignId } },
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      result[stat._id.toLowerCase()] = stat.count;
    });

    return result;
  },

  // Get campaign statistics
  async getCampaignStats(req, res) {
    try {
      const stats = await campaignController.getCampaignStatsHelper(
        req.params.id
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign stats',
        error: error.message,
      });
    }
  },

  // Get campaign history with stats
  async getCampaignHistory(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: user not found',
        });
      }

      const campaigns = await Campaign.find({ createdBy: req.user._id })
        .populate('segmentId', 'name audienceSize')
        .sort({ createdAt: -1 });

      const campaignHistory = await Promise.all(
        campaigns.map(async (campaign) => {
          const stats = await campaignController.getCampaignStatsHelper(
            campaign._id
          );
          return {
            ...campaign.toObject(),
            stats,
          };
        })
      );

      res.json({
        success: true,
        data: campaignHistory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign history',
        error: error.message,
      });
    }
  },
};

module.exports = campaignController;
