const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const {
  communicationLogIdSchema,
} = require('../validators/communicationLogValidator');

// Mock data for now
let communicationLogs = [];

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Get communication log by ID
 *     description: Retrieves a specific communication log entry
 *     tags: [Communication Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Communication log ID
 *     responses:
 *       200:
 *         description: Communication log retrieved successfully
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
 *                   $ref: '#/components/schemas/CommunicationLog'
 *       404:
 *         description: Communication log not found
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
