/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in to access this resource.',
    redirectUrl: '/auth/google',
  });
};

/**
 * Middleware to check if user is NOT authenticated (for login/register routes)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.status(400).json({
    success: false,
    message: 'You are already logged in.',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

/**
 * Middleware to get current user info (optional authentication)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getCurrentUser = (req, res, next) => {
  // Attach user info to request if authenticated, otherwise continue
  req.currentUser = req.isAuthenticated() ? req.user : null;
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  getCurrentUser,
};
