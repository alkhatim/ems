module.exports = function(req, res, next) {
  const roles = req.user.roles;
  if (!roles.includes("hrUser"))
    return res.status(403).send("You don't have the required permissions");
  next();
};
