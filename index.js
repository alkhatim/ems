const app = require("express")();
const mongoose = require("mongoose");
const config = require("config");
const seedUsers = require("./seeders/seedUsers");

db = config.get("db");
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("connected to", db))
  .catch(e => console.log(e));
