const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { communicationLogValidator } = require('../validators');

// @desc    Delivery receipt webhook (no auth needed for vendor callbacks)
// @route   POST /api/communications/delivery-receipt
router.post('/delivery-receipt', communicationController.handleDeliveryReceipt);

// Apply authentication to remaining routes
router.use(ensureAuth);

// @desc    Get communication logs
// @route   GET /api/communications
router.get('/', communicationController.getCommunicationLogs);

// @desc    Get communication log by ID
// @route   GET /api/communications/:id
router.get(
  '/:id',
  validate({ params: communicationLogValidator.communicationLogIdSchema }),
  communicationController.getCommunicationLogById
);

// @desc    Get communication logs by campaign
// @route   GET /api/communications/campaign/:campaignId
router.get('/campaign/:campaignId', communicationController.getLogsByCampaign);

// @desc    Update delivery status
// @route   PUT /api/communications/:id/status
router.put(
  '/:id/status',
  validate({ params: communicationLogValidator.communicationLogIdSchema }),
  communicationController.updateDeliveryStatus
);

module.exports = router;
