const mongoose = require("mongoose");
const config = require("config");
const logger = require("../startup/logger");

module.exports = function() {
  const dbConnectionString = config.get("dbConnectionString");
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(dbConnectionString, {
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => console.log("connected to", dbConnectionString))
    .catch(e => logger.error(e));
};
