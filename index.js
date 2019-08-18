const express = require("express");
const app = express();
const usersRouter = require("./routers/users");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

require("./startup/db")();

app.use(express.json());
app.use("/api/users", usersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on port", port));
