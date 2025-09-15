const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { campaignValidator } = require('../validators');

// Apply authentication to all routes
router.use(ensureAuth);

// @desc    Create campaign
// @route   POST /api/campaigns
router.post(
  '/',
  validate({ body: campaignValidator.campaignCreateSchema }),
  campaignController.createCampaign
);

// @desc    Get all campaigns for user
// @route   GET /api/campaigns
router.get('/', campaignController.getAllCampaigns);

// @desc    Get campaign by ID
// @route   GET /api/campaigns/:id
router.get(
  '/:id',
  validate({ params: campaignValidator.campaignIdSchema }),
  campaignController.getCampaignById
);

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
router.put(
  '/:id',
  validate({
    params: campaignValidator.campaignIdSchema,
    body: campaignValidator.campaignUpdateSchema,
  }),
  campaignController.updateCampaign
);

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
router.delete(
  '/:id',
  validate({ params: campaignValidator.campaignIdSchema }),
  campaignController.deleteCampaign
);

// @desc    Get campaign statistics
// @route   GET /api/campaigns/:id/stats
router.get(
  '/:id/stats',
  validate({ params: campaignValidator.campaignIdSchema }),
  campaignController.getCampaignStats
);

// @desc    Get campaign history with stats
// @route   GET /api/campaigns/history
router.get('/history', campaignController.getCampaignHistory);

module.exports = router;
