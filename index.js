const express = require("express");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/db")();

app.use(express.json());

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("listening on port", port));
