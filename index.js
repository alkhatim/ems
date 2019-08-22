const express = require("express");
const app = express();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const usersRouter = require("./routes/users");
const employeesRouter = require("./routes/employees");

require("./startup/db")();

app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/employees", employeesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on port", port));

// require("./seeding/seed")();
