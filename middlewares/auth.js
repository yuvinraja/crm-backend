// Protect routes
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Unauthorized" });
}

// Allow access only if user is not authenticated
function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/dashboard"); // or wherever you want to send logged-in users
}

module.exports = { ensureAuth, ensureGuest };
