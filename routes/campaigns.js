const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  campaignCreateSchema,
  campaignUpdateSchema,
  campaignIdSchema,
} = require('../validators/campaignValidator');

// Mock data for now (replace with actual database operations)
let campaigns = [];
let communicationLogs = []; // Mock communication logs
let nextId = 1;

/**
 * POST /campaigns - Create a campaign for a segment
 */
router.post('/', validate({ body: campaignCreateSchema }), (req, res) => {
  try {
    const campaign = {
      id: nextId++,
      ...req.body,
      stats: {
        sent: 0,
        delivered: 0,
        failed: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    campaigns.push(campaign);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign',
      error: error.message,
    });
  }
});

/**
 * GET /campaigns - List all campaigns with stats
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Campaigns retrieved successfully',
      data: campaigns,
      count: campaigns.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve campaigns',
      error: error.message,
    });
  }
});

/**
 * GET /campaigns/:id - View campaign details
 */
router.get('/:id', validate({ params: campaignIdSchema }), (req, res) => {
  try {
    const campaign = campaigns.find((c) => c.id === parseInt(req.params.id));

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    res.json({
      success: true,
      message: 'Campaign retrieved successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve campaign',
      error: error.message,
    });
  }
});

/**
 * PUT /campaigns/:id - Update campaign (reschedule, edit message)
 */
router.put(
  '/:id',
  validate({
    params: campaignIdSchema,
    body: campaignUpdateSchema,
  }),
  (req, res) => {
    try {
      const campaignIndex = campaigns.findIndex(
        (c) => c.id === parseInt(req.params.id)
      );

      if (campaignIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
      }

      campaigns[campaignIndex] = {
        ...campaigns[campaignIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaigns[campaignIndex],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update campaign',
        error: error.message,
      });
    }
  }
);

/**
 * DELETE /campaigns/:id - Delete campaign
 */
router.delete('/:id', validate({ params: campaignIdSchema }), (req, res) => {
  try {
    const campaignIndex = campaigns.findIndex(
      (c) => c.id === parseInt(req.params.id)
    );

    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    const deletedCampaign = campaigns.splice(campaignIndex, 1)[0];

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
      data: deletedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete campaign',
      error: error.message,
    });
  }
});

/**
 * GET /campaigns/:id/logs - Get logs for one campaign
 */
router.get('/:id/logs', validate({ params: campaignIdSchema }), (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);

    // Check if campaign exists
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    // Filter communication logs for this campaign
    const campaignLogs = communicationLogs.filter(
      (log) => log.campaignId === campaignId
    );

    res.json({
      success: true,
      message: 'Campaign logs retrieved successfully',
      data: campaignLogs,
      count: campaignLogs.length,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve campaign logs',
      error: error.message,
    });
  }
});

module.exports = router;
