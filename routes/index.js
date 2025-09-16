const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const customerRoutes = require('./customers');
const orderRoutes = require('./orders');
const segmentRoutes = require('./segments');
const campaignRoutes = require('./campaigns');
const communicationRoutes = require('./communications');

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/segments', segmentRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/communications', communicationRoutes);

module.exports = router;
