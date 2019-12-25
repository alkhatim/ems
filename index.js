const express = require("express");
const app = express();
require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const lookupsRouter = require("./routes/lookups");
const usersRouter = require("./routes/users");
const employeesRouter = require("./routes/employees");
const overtimesRouter = require("./routes/overtimes");
const deductionsRouter = require("./routes/deductions");
const absencePermissionsRouter = require("./routes/absencePermissions");
const vacationsRouter = require("./routes/vacations");
const missionsRouter = require("./routes/missions");
const loansRouter = require("./routes/loans");
const batchesRouter = require("./routes/batches");
const auth = require("./middleware/auth");
const errors = require("./middleware/errors");

require("./startup/db")();

app.use(express.json());
// app.use(auth);
app.use("/api/lookups", lookupsRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", usersRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/overtimes", overtimesRouter);
app.use("/api/deductions", deductionsRouter);
app.use("/api/absencePermissions", absencePermissionsRouter);
app.use("/api/vacations", vacationsRouter);
app.use("/api/missions", missionsRouter);
app.use("/api/loans", loansRouter);
app.use("/api/batches", batchesRouter);
app.use(errors);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on port", port));

// require("./seeding/seed")();
