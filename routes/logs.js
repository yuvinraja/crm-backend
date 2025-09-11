const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  communicationLogIdSchema,
} = require('../validators/communicationLogValidator');

// Mock data for now (replace with actual database operations)
let communicationLogs = [];

/**
 * GET /logs/:id - Get specific log entry
 */
router.get(
  '/:id',
  validate({ params: communicationLogIdSchema }),
  (req, res) => {
    try {
      const log = communicationLogs.find(
        (l) => l.id === parseInt(req.params.id)
      );

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Communication log not found',
        });
      }

      res.json({
        success: true,
        message: 'Communication log retrieved successfully',
        data: log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve communication log',
        error: error.message,
      });
    }
  }
);

module.exports = router;
