const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { segmentValidator } = require('../validators');

// Apply authentication to all routes
router.use(ensureAuth);

/**
 * @swagger
 * tags:
 *   name: Segments
 *   description: Segment management
 */

/**
 * @swagger
 * /segments:
 *   post:
 *     summary: Create a new segment
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Segment'
 *     responses:
 *       201:
 *         description: The created segment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segment'
 *       400:
 *         description: Bad request
 */
router.post(
  '/',
  validate({ body: segmentValidator.segmentCreateSchema }),
  segmentController.createSegment
);

/**
 * @swagger
 * /segments:
 *   get:
 *     summary: Get all segments
 *     tags: [Segments]
 *     responses:
 *       200:
 *         description: A list of segments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Segment'
 */
router.get('/', segmentController.getAllSegments);

/**
 * @swagger
 * /segments/{id}:
 *   get:
 *     summary: Get a segment by ID
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The segment ID
 *     responses:
 *       200:
 *         description: The segment description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment not found
 */
router.get(
  '/:id',
  validate({ params: segmentValidator.segmentIdSchema }),
  segmentController.getSegmentById
);

/**
 * @swagger
 * /segments/{id}:
 *   put:
 *     summary: Update a segment
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The segment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Segment'
 *     responses:
 *       200:
 *         description: The updated segment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment not found
 */
router.put(
  '/:id',
  validate({
    params: segmentValidator.segmentIdSchema,
    body: segmentValidator.segmentUpdateSchema,
  }),
  segmentController.updateSegment
);

/**
 * @swagger
 * /segments/{id}:
 *   delete:
 *     summary: Delete a segment
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The segment ID
 *     responses:
 *       200:
 *         description: Segment deleted
 *       404:
 *         description: Segment not found
 */
router.delete(
  '/:id',
  validate({ params: segmentValidator.segmentIdSchema }),
  segmentController.deleteSegment
);

/**
 * @swagger
 * /segments/{id}/audience:
 *   get:
 *     summary: Preview segment audience
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The segment ID
 *     responses:
 *       200:
 *         description: A list of customers in the segment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Segment not found
 */
router.get(
  '/:id/customers',
  validate({ params: segmentValidator.segmentIdSchema }),
  segmentController.getSegmentCustomers
);

/**
 * @swagger
 * /segments/preview:
 *   post:
 *     summary: Preview segment audience without saving
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conditions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Condition'
 *               logic:
 *                 type: string
 *                 enum: [AND, OR]
 *     responses:
 *       200:
 *         description: Audience preview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audienceSize:
 *                   type: number
 *                 sampleCustomers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 */
router.post(
  '/preview',
  validate({ body: segmentValidator.segmentPreviewSchema }),
  segmentController.previewSegment
);


module.exports = router;
