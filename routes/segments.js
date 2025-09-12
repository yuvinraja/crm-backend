const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  segmentCreateSchema,
  segmentUpdateSchema,
  segmentIdSchema,
} = require('../validators/segmentValidator');

// Mock data for now
let segments = [];
let nextId = 1;

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
router.post('/', validate({ body: segmentCreateSchema }), (req, res) => {
  try {
    const segment = {
      id: nextId++,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    segments.push(segment);

    res.status(201).json({
      success: true,
      message: 'Segment created successfully',
      data: segment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create segment',
      error: error.message,
    });
  }
});

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
router.get('/', (req, res) => {
  try {
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
router.get('/:id', validate({ params: segmentIdSchema }), (req, res) => {
  try {
    const segment = segments.find((s) => s.id === parseInt(req.params.id));

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
});

/**
 * PUT /segments/:id - Update rules or name
 */
router.put(
  '/:id',
  validate({
    params: segmentIdSchema,
    body: segmentUpdateSchema,
  }),
  (req, res) => {
    try {
      const segmentIndex = segments.findIndex(
        (s) => s.id === parseInt(req.params.id)
      );

      if (segmentIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Segment not found',
        });
      }

      segments[segmentIndex] = {
        ...segments[segmentIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      res.json({
        success: true,
        message: 'Segment updated successfully',
        data: segments[segmentIndex],
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
router.delete('/:id', validate({ params: segmentIdSchema }), (req, res) => {
  try {
    const segmentIndex = segments.findIndex(
      (s) => s.id === parseInt(req.params.id)
    );

    if (segmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found',
      });
    }

    const deletedSegment = segments.splice(segmentIndex, 1)[0];

    res.json({
      success: true,
      message: 'Segment deleted successfully',
      data: deletedSegment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete segment',
      error: error.message,
    });
  }
});

module.exports = router;
