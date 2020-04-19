const mongoose = require("mongoose");
const config = require("config");
const logger = require("../startup/logger");

module.exports = function() {
  const dbConnectionString = config.get("dbConnectionString");
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(dbConnectionString, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => console.log("connected to database"))
    .catch(e => logger.error(e));
};
