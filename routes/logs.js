const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { isAuthenticated } = require('../middlewares/auth');
const {
  communicationLogIdSchema,
} = require('../validators/communicationLogValidator');
const CommunicationLog = require('../models/CommunicationLog');

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get all communication logs
 *     description: Retrieves a list of all communication logs
 *     tags: [Communication Logs]
 *     responses:
 *       200:
 *         description: Communication logs retrieved successfully
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
 *                     $ref: '#/components/schemas/CommunicationLog'
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
    const logs = await CommunicationLog.find()
      .populate('campaignId', 'name message status')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Communication logs retrieved successfully',
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve communication logs',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Get communication log by ID
 *     description: Retrieves a specific communication log entry
 *     tags: [Communication Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Communication log ID
 *     responses:
 *       200:
 *         description: Communication log retrieved successfully
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
 *                   $ref: '#/components/schemas/CommunicationLog'
 *       404:
 *         description: Communication log not found
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
  validate({ params: communicationLogIdSchema }),
  async (req, res) => {
    try {
      const log = await CommunicationLog.findById(req.params.id)
        .populate('campaignId', 'name message status')
        .populate('customerId', 'name email');

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Communication log not found',
        });
      }

      res.json({
        success: true,
        message: 'Communication log retrieved successfully',
        data: log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve communication log',
        error: error.message,
      });
    }
  }
);

module.exports = router;
