const express = require("express");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/db")();

app.use(express.json());
