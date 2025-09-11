const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  segmentCreateSchema,
  segmentUpdateSchema,
  segmentIdSchema,
} = require('../validators/segmentValidator');

// Mock data for now (replace with actual database operations)
let segments = [];
let nextId = 1;

/**
 * POST /segments - Create a segment with rules
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
 * GET /segments - List all segments
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
