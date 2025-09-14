const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { isAuthenticated } = require('../middlewares/auth');
const {
  segmentCreateSchema,
  segmentUpdateSchema,
  segmentIdSchema,
} = require('../validators/segmentValidator');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');

/**
 * @swagger
 * /segments:
 *   post:
 *     summary: Create a new customer segment
 *     description: Creates a new customer segment with specific criteria
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - criteria
 *             properties:
 *               name:
 *                 type: string
 *                 description: Segment name
 *               criteria:
 *                 type: object
 *                 description: Criteria for customer segmentation
 *           example:
 *             name: "High Value Customers"
 *             criteria:
 *               totalSpending:
 *                 $gte: 1000
 *     responses:
 *       201:
 *         description: Segment created successfully
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
 *                   $ref: '#/components/schemas/Segment'
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
  validate({ body: segmentCreateSchema }),
  async (req, res) => {
    try {
      const segment = new Segment({
        name: req.body.name,
        description: req.body.description,
        rules: req.body.rules || [],
        createdBy: req.user._id,
      });

      await segment.save();

      // Create a campaign for this segment
      const Campaign = require('../models/Campaign');
      const CommunicationLog = require('../models/CommunicationLog');
      const campaignMessage = `Hi {{name}}, here’s 10% off on your next order!`;
      const campaign = new Campaign({
        name: `Auto Campaign for ${segment.name}`,
        message: campaignMessage,
        segmentId: segment._id,
        status: 'Draft',
      });
      await campaign.save();

      // Find customers matching segment rules (simple implementation: all active customers)
      // TODO: Implement actual rule-based filtering
      const customers = await Customer.find({ isActive: true });

      // Create communication logs for each customer
      const logs = [];
      for (const customer of customers) {
        const personalizedMsg = campaignMessage.replace(
          '{{name}}',
          customer.name
        );
        logs.push({
          campaignId: campaign._id,
          customerId: customer._id,
          message: personalizedMsg,
          deliveryStatus: 'PENDING',
        });
      }
      if (logs.length > 0) {
        await CommunicationLog.insertMany(logs);
      }

      res.status(201).json({
        success: true,
        message: 'Segment created, campaign and logs initiated',
        data: {
          segment,
          campaign,
          logsCreated: logs.length,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create segment and campaign',
        error: error.message,
      });
    }
  }
);

/**
 * @swagger
 * /segments:
 *   get:
 *     summary: Get all customer segments
 *     description: Retrieves a list of all customer segments
 *     tags: [Segments]
 *     responses:
 *       200:
 *         description: Segments retrieved successfully
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
 *                     $ref: '#/components/schemas/Segment'
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
    const segments = await Segment.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Segments retrieved successfully',
      data: segments,
      count: segments.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve segments',
      error: error.message,
    });
  }
});

/**
 * GET /segments/:id - View segment details
 */
router.get(
  '/:id',
  isAuthenticated,
  validate({ params: segmentIdSchema }),
  async (req, res) => {
    try {
      const segment = await Segment.findById(req.params.id).populate(
        'createdBy',
        'name email'
      );

      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      res.json({
        success: true,
        message: 'Segment retrieved successfully',
        data: segment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve segment',
        error: error.message,
      });
    }
  }
);

/**
 * PUT /segments/:id - Update rules or name
 */
router.put(
  '/:id',
  isAuthenticated,
  validate({
    params: segmentIdSchema,
    body: segmentUpdateSchema,
  }),
  async (req, res) => {
    try {
      const segment = await Segment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate('createdBy', 'name email');

      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      res.json({
        success: true,
        message: 'Segment updated successfully',
        data: segment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update segment',
        error: error.message,
      });
    }
  }
);

/**
 * DELETE /segments/:id - Delete segment
 */
router.delete(
  '/:id',
  isAuthenticated,
  validate({ params: segmentIdSchema }),
  async (req, res) => {
    try {
      const segment = await Segment.findByIdAndDelete(req.params.id);

      if (!segment) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      res.json({
        success: true,
        message: 'Segment deleted successfully',
        data: segment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete segment',
        error: error.message,
      });
    }
  }
);

module.exports = router;
