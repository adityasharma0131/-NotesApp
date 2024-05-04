exports.isLoggedIn = function(req, res, next) {
  if(req.user) {
    next();
  } else {
    res.status(401).send('hello jiii you are not allowed');
  }
};