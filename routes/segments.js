const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');
const { ensureAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { segmentValidator } = require('../validators');

// Apply authentication to all routes
router.use(ensureAuth);

// @desc    Create segment
// @route   POST /api/segments
router.post(
  '/',
  validate({ body: segmentValidator.segmentCreateSchema }),
  segmentController.createSegment
);

// @desc    Get all segments for user
// @route   GET /api/segments
router.get('/', segmentController.getAllSegments);

// @desc    Get segment by ID
// @route   GET /api/segments/:id
router.get(
  '/:id',
  validate({ params: segmentValidator.segmentIdSchema }),
  segmentController.getSegmentById
);

// @desc    Update segment
// @route   PUT /api/segments/:id
router.put(
  '/:id',
  validate({
    params: segmentValidator.segmentIdSchema,
    body: segmentValidator.segmentUpdateSchema,
  }),
  segmentController.updateSegment
);

// @desc    Delete segment
// @route   DELETE /api/segments/:id
router.delete(
  '/:id',
  validate({ params: segmentValidator.segmentIdSchema }),
  segmentController.deleteSegment
);

// @desc    Preview segment audience
// @route   POST /api/segments/preview
router.post('/preview', segmentController.previewSegment);

// @desc    Get segment customers
// @route   GET /api/segments/:id/customers
router.get(
  '/:id/customers',
  validate({ params: segmentValidator.segmentIdSchema }),
  segmentController.getSegmentCustomers
);

module.exports = router;
