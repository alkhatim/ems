const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
  db = config.get("db");
  mongoose.set("useCreateIndex", true);
  mongoose
    .connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("connected to", db))
    .catch(e => console.log(e));
};
