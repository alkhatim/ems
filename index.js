const app = require("express")();
const mongoose = require("mongoose");
const config = require("config");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);

db = config.get("db");
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("connected to", db))
  .catch(e => console.log(e));
