const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { ensureAuth, ensureGuest } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to dashboard on success or login on failure
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const frontendUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://crm-frontend-rosy-delta.vercel.app/'
        : 'http://localhost:3001');

    // Redirect to frontend dashboard
    res.redirect(frontendUrl);
  }
);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/user', ensureAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Logout failed
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
