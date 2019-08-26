const mongoose = require("mongoose");

async function seed() {
  // for (key in mongoose.connection.collections) {
  //   mongoose.connection.dropCollection(key);
  // }

  console.log("all done...");
}

module.exports = seed;
