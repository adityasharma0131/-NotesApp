// isLoggedIn middleware function for session authentication
exports.isLoggedIn = (req, res, next) => {
  // Check if user is authenticated
  if (req.user) {
    return next(); // User is authenticated, proceed to the next middleware
  } else {
    // User is not authenticated, redirect to login page or do something else
    res.sendStatus(401);
  }
};

