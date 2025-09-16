const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const axios = require('axios');

const campaignController = {
  // Dummy Vendor API simulation
  async sendToVendorAPI(customer, message, campaignId) {
    const isSuccess = Math.random() < 0.9;
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setTimeout(
      async () => {
        try {
          await axios.post(
            `${process.env.BASE_URL || 'http://localhost:3000'}/communications/delivery-receipt`,
            {
              messageId,
              customerId: customer._id,
              status: isSuccess ? 'SENT' : 'FAILED',
              timestamp: new Date().toISOString(),
              errorMessage: isSuccess
                ? undefined
                : 'Simulated delivery failure',
            }
          );
        } catch (err) {
          console.error('Failed to send delivery receipt:', err.message);
        }
      },
      Math.random() * 5000 + 500
    );

    return { success: isSuccess, messageId };
  },

  // Create campaign and initiate delivery
  async createCampaign(req, res) {
    try {
      const { name, segmentId, message } = req.body;

      const segment = await Segment.findById(segmentId);
      if (!segment) {
        return res
          .status(404)
          .json({ success: false, message: 'Segment not found' });
      }

      // Build query from segment conditions
      const segmentController = require('./segmentController');
      const query = segmentController.buildSegmentQuery(
        segment.conditions,
        segment.logic
      );
      const customers = await Customer.find(query);

      const campaign = await Campaign.create({
        name,
        segmentId,
        message,
        createdBy: req.user._id,
        stats: { sent: 0, failed: 0, audienceSize: customers.length },
      });

      // Init communication logs
      const logs = customers.map((c) => ({
        campaignId: campaign._id,
        customerId: c._id,
        deliveryStatus: 'PENDING',
      }));
      await CommunicationLog.insertMany(logs);

      // Start async delivery
      setImmediate(() =>
        campaignController.initiateDelivery(campaign._id, customers, message)
      );

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully and delivery initiated',
        data: campaign,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to create campaign',
        error: err.message,
      });
    }
  },

  // Initiate delivery process
  async initiateDelivery(campaignId, customers, messageTemplate) {
    await Promise.allSettled(
      customers.map(async (c) => {
        const personalizedMessage = messageTemplate.replace(
          /\{name\}/gi,
          c.name
        );
        await campaignController.sendToVendorAPI(
          c,
          personalizedMessage,
          campaignId
        );
      })
    );
  },

  // Get all campaigns for user
  async getAllCampaigns(req, res) {
    try {
      const campaigns = await Campaign.find({ createdBy: req.user._id })
        .populate('segmentId', 'name')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: campaigns });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get campaign by ID
  async getCampaignById(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id)
        .populate('segmentId', 'name conditions logic')
        .populate('createdBy', 'name email');

      if (!campaign) {
        return res
          .status(404)
          .json({ success: false, message: 'Campaign not found' });
      }

      res.json({ success: true, data: campaign });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = campaignController;
