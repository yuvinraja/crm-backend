const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');
const axios = require('axios');

// Dummy vendor API: Simulate delivery for a communication log
router.post('/send', async (req, res) => {
  try {
    const { logId } = req.body;
    if (!logId) {
      return res
        .status(400)
        .json({ success: false, message: 'logId required' });
    }
    // Simulate delivery result
    const isSent = Math.random() < 0.9;
    const deliveryStatus = isSent ? 'SENT' : 'FAILED';
    const vendorResponse = {
      messageId: logId,
      timestamp: new Date(),
      errorMessage: isSent ? undefined : 'Simulated delivery failure',
    };
    // Call Delivery Receipt API
    await axios.post(
      `${process.env.DELIVERY_RECEIPT_URL || 'http://localhost:3000'}/vendor/receipt`,
      {
        logId,
        deliveryStatus,
        vendorResponse,
      }
    );
    res.json({ success: true, logId, deliveryStatus });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Vendor API error',
        error: error.message,
      });
  }
});

// Delivery Receipt API: Update delivery status in communication log
router.post('/receipt', async (req, res) => {
  try {
    const { logId, deliveryStatus, vendorResponse } = req.body;
    if (!logId || !deliveryStatus) {
      return res
        .status(400)
        .json({ success: false, message: 'logId and deliveryStatus required' });
    }
    // Use batch updater
    const { queueDeliveryUpdate } = require('../utils/batchDeliveryUpdater');
    queueDeliveryUpdate({ logId, deliveryStatus, vendorResponse });
    res.json({ success: true, logId, deliveryStatus, batched: true });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Receipt API error',
        error: error.message,
      });
  }
});

module.exports = router;
