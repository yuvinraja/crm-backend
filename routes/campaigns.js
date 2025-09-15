const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { campaignValidator } = require('../validators');

router.use(ensureAuth);

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: The created campaign
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Bad request
 */
router.post(
  '/',
  validate({ body: campaignValidator.campaignCreateSchema }),
  campaignController.createCampaign
);

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: A list of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */
router.get('/', campaignController.getAllCampaigns);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: The campaign description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 */
router.get(
  '/:id',
  validate({ params: campaignValidator.campaignIdSchema }),
  campaignController.getCampaignById
);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: The updated campaign
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 */
router.put(
  '/:id',
  validate({
    params: campaignValidator.campaignIdSchema,
    body: campaignValidator.campaignUpdateSchema,
  }),
  campaignController.updateCampaign
);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: Campaign deleted
 *       404:
 *         description: Campaign not found
 */
router.delete(
  '/:id',
  validate({ params: campaignValidator.campaignIdSchema }),
  campaignController.deleteCampaign
);

/**
 * @swagger
 * /campaigns/{id}/stats:
 *   get:
 *     summary: Get campaign statistics
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The campaign ID
 *     responses:
 *       200:
 *         description: Campaign statistics
 *       404:
 *         description: Campaign not found
 */
router.get(
  '/:id/stats',
  validate({ params: campaignValidator.campaignIdSchema }),
  campaignController.getCampaignStats
);

/**
 * @swagger
 * /campaigns/history:
 *   get:
 *     summary: Get campaign history with stats
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Campaign history with stats
 */
router.get('/history', campaignController.getCampaignHistory);

module.exports = router;
