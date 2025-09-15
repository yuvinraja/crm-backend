const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { communicationLogValidator } = require('../validators');

/**
 * @swagger
 * tags:
 *   name: Communications
 *   description: Communication log management
 */

/**
 * @swagger
 * /communications/delivery-receipt:
 *   post:
 *     summary: Handle delivery receipts from a vendor
 *     tags: [Communications]
 *     responses:
 *       200:
 *         description: Delivery receipt handled
 */
router.post('/delivery-receipt', communicationController.handleDeliveryReceipt);

// Apply authentication to remaining routes
router.use(ensureAuth);

/**
 * @swagger
 * /communications:
 *   get:
 *     summary: Get all communication logs
 *     tags: [Communications]
 *     responses:
 *       200:
 *         description: A list of communication logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommunicationLog'
 */
router.get('/', communicationController.getCommunicationLogs);

/**
 * @swagger
 * /communications/{id}:
 *   get:
 *     summary: Get a communication log by ID
 *     tags: [Communications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The communication log ID
 *     responses:
 *       200:
 *         description: The communication log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommunicationLog'
 *       404:
 *         description: Communication log not found
 */
router.get(
  '/:id',
  validate({ params: communicationLogValidator.communicationLogIdSchema }),
  communicationController.getCommunicationLogById
);

/**
 * @swagger
 * /communications/campaign/{campaignId}:
 *   get:
 *     summary: Get communication logs by campaign
 *     tags: [Communications]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: A list of communication logs for the campaign
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommunicationLog'
 */
router.get('/campaign/:campaignId', communicationController.getLogsByCampaign);

/**
 * @swagger
 * /communications/{id}/status:
 *   put:
 *     summary: Update delivery status
 *     tags: [Communications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The communication log ID
 *     responses:
 *       200:
 *         description: Delivery status updated
 *       404:
 *         description: Communication log not found
 */
router.put(
  '/:id/status',
  validate({ params: communicationLogValidator.communicationLogIdSchema }),
  communicationController.updateDeliveryStatus
);

module.exports = router;
