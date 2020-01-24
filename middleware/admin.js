module.exports = function(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).send("You don't have the required permissions");
  next();
};
