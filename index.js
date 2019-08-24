const express = require("express");
const app = express();
require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const usersRouter = require("./routes/users");
const employeesRouter = require("./routes/employees");
const overtimeRouter = require("./routes/overtime");
const errors = require("./middleware/errors");

require("./startup/db")();
require("./startup/logger")();

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/overtime", overtimeRouter);
app.use(errors);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on port", port));

// require("./seeding/seed")();
