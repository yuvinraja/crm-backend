const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { isAuthenticated } = require('../middlewares/auth');
const {
  campaignCreateSchema,
  campaignUpdateSchema,
  campaignIdSchema,
} = require('../validators/campaignValidator');
const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const CommunicationLog = require('../models/CommunicationLog');

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
router.post(
  '/',
  isAuthenticated,
  validate({ body: campaignCreateSchema }),
  async (req, res) => {
    try {
      // Verify segment exists
      const segment = await Segment.findById(req.body.segmentId);
      if (!segment) {
        return res.status(400).json({
          success: false,
          message: 'Segment not found',
        });
      }

      const campaign = new Campaign({
        name: req.body.name,
        message: req.body.message,
        segmentId: req.body.segmentId,
        status: req.body.status || 'Draft',
        scheduledAt: req.body.scheduledAt,
      });

      await campaign.save();

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
  }
);

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
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('segmentId', 'name description')
      .sort({ createdAt: -1 });

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
router.get(
  '/:id',
  isAuthenticated,
  validate({ params: campaignIdSchema }),
  async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id).populate(
        'segmentId',
        'name description'
      );

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
  }
);

/**
 * PUT /campaigns/:id - Update campaign (reschedule, edit message)
 */
router.put(
  '/:id',
  isAuthenticated,
  validate({
    params: campaignIdSchema,
    body: campaignUpdateSchema,
  }),
  async (req, res) => {
    try {
      // If segmentId is being updated, verify it exists
      if (req.body.segmentId) {
        const segment = await Segment.findById(req.body.segmentId);
        if (!segment) {
          return res.status(400).json({
            success: false,
            message: 'Segment not found',
          });
        }
      }

      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('segmentId', 'name description');

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
  }
);

/**
 * DELETE /campaigns/:id - Delete campaign
 */
router.delete(
  '/:id',
  isAuthenticated,
  validate({ params: campaignIdSchema }),
  async (req, res) => {
    try {
      const campaign = await Campaign.findByIdAndDelete(req.params.id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
      }

      // Also delete related communication logs
      await CommunicationLog.deleteMany({ campaignId: req.params.id });

      res.json({
        success: true,
        message: 'Campaign deleted successfully',
        data: campaign,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete campaign',
        error: error.message,
      });
    }
  }
);

/**
 * GET /campaigns/:id/logs - Get logs for one campaign
 */
router.get(
  '/:id/logs',
  isAuthenticated,
  validate({ params: campaignIdSchema }),
  async (req, res) => {
    try {
      // Check if campaign exists
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
      }

      // Get communication logs for this campaign
      const campaignLogs = await CommunicationLog.find({
        campaignId: req.params.id,
      })
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: 'Campaign logs retrieved successfully',
        data: campaignLogs,
        count: campaignLogs.length,
        campaign: {
          id: campaign._id,
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
  }
);

module.exports = router;
