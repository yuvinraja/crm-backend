var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Returns a simple message to confirm the API is running
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CRM Backend API"
 *                 title:
 *                   type: string
 *                   example: "Express"
 */
router.get('/', function (req, res, next) {
  res.json({ message: 'CRM Backend API', title: 'Express' });
});

module.exports = router;
