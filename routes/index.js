const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const customerRoutes = require('./customers');
const orderRoutes = require('./orders');
const segmentRoutes = require('./segments');
const campaignRoutes = require('./campaigns');
const communicationRoutes = require('./communications');

router.use('/auth', authRoutes);
router.use('/api/customers', customerRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/segments', segmentRoutes);
router.use('/api/campaigns', campaignRoutes);
router.use('/api/communications', communicationRoutes);

module.exports = router;
