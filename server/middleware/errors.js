const logger = require("../startup/logger");

module.exports = function(err, req, res, next) {
  logger.error(err);
  res.status(500).send("Something failed on the server! try again later");
  next(err);
};
