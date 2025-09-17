// Protect routes
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Unauthorized' });
}

// Allow access only if user is not authenticated
function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  const frontendUrl =
    process.env.FRONTEND_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://crm-frontend-rosy-delta.vercel.app/'
      : 'http://localhost:3001');

  // Redirect to frontend dashboard
  res.redirect(frontendUrl);
}

module.exports = { ensureAuth, ensureGuest };
