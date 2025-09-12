const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  campaignCreateSchema,
  campaignUpdateSchema,
  campaignIdSchema,
} = require('../validators/campaignValidator');

// Mock data for now
let campaigns = [];
let communicationLogs = []; // Mock communication logs
let nextId = 1;

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     description: Creates a new marketing campaign for a specific segment
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - message
 *               - segmentId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Campaign name
 *               message:
 *                 type: string
 *                 description: Campaign message content
 *               segmentId:
 *                 type: string
 *                 description: ID of the target segment
 *               status:
 *                 type: string
 *                 enum: [draft, active, completed, cancelled]
 *                 description: Campaign status
 *           example:
 *             name: "Summer Sale Campaign"
 *             message: "Get 20% off on all summer items!"
 *             segmentId: "1"
 *             status: "draft"
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     description: Retrieves a list of all campaigns with their statistics
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Campaigns retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campaign'
 *                 count:
 *                   type: number
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get campaign details
 *     description: Retrieves detailed information about a specific campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
