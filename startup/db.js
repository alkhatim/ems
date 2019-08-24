const mongoose = require("mongoose");
const config = require("config");
const logger = require("../logs/logger");

module.exports = function() {
  db = config.get("db");
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("connected to", db))
    .catch(e => logger.error(e));
};
