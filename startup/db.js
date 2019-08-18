const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
  db = config.get("db");
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("connected to", db))
    .catch(e => console.log(e));
};
