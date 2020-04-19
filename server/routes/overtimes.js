const express = require("express");
const router = express.Router();
const _ = require("lodash");
const config = require("config");
const admin = require("../middleware/admin");
const { Overtime, validate } = require("../models/Overtime");
const { OvertimeType } = require("../models/OvertimeType");
const { Employee } = require("../models/Employee");
const { State } = require("../models/State");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name salaryInfo"
  );

  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default overtimes state is missing from the server!");

  const type = await OvertimeType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  switch (type.name) {
    case "Hours":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.totalSalary / (30 * config.get("dailyHours"))) *
        config.get("overtimeFactor");
      break;
    case "Days":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.totalSalary / 30) *
        config.get("overtimeFactor");
      break;
  }

  const overtime = new Overtime({
    employee: _.pick(employee, ["_id", "name"]),
    date: req.body.date,
    notes: req.body.notes,
    state,
    type,
    amount: req.body.amount,
    total: req.body.total
  });

  await overtime.save();

  res.status(201).send(overtime);
});

router.get("/", async (req, res) => {
  const overtimes = await Overtime.find(req.query);
  res.status(200).send(overtimes);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const overtime = await Overtime.findById({ _id: req.params.id });
  if (!overtime)
    return res.status(404).send("There is no overtime with the given ID");
  res.status(200).send(overtime);
});

router.put("/:id", async (req, res) => {
  let overtime = await Overtime.findById(req.params.id);
  if (!overtime)
    return res.status(404).send("There is no overtime with the given ID");

  if (overtime.state.name !== "New")
    return res.status(400).send("You can only modify new overtimes");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name salaryInfo"
  );

  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const type = await OvertimeType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  switch (type.name) {
    case "Hours":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.totalSalary / (30 * config.get("dailyHours"))) *
        config.get("overtimeFactor");
      break;
    case "Days":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.totalSalary / 30) *
        config.get("overtimeFactor");
      break;
  }

  overtime = {
    employee: _.pick(employee, ["_id", "name"]),
    date: req.body.date,
    notes: req.body.notes,
    state: overtime.state,
    type,
    amount: req.body.amount,
    total: req.body.total
  };

  overtime = await Overtime.findByIdAndUpdate(req.params.id, overtime, {
    new: true
  });

  res.status(200).send(overtime);
});

router.delete("/:id", admin, validateObjectId, async (req, res) => {
  const overtime = await Overtime.findById(req.params.id).select("state");
  if (!overtime)
    return res.status(404).send("There is no overtime with the given ID");

  if (overtime.state.name == "Closed")
    return res.status(400).send("You can't delete closed overtimes");

  await Overtime.findByIdAndDelete(req.params.id);

  res.status(200).send(overtime);
});

//states
router.post("/approve/:id", admin, async (req, res) => {
  let overtime = await Overtime.findById(req.params.id);
  if (overtime.state.name !== "New")
    return res.status(400).send("You can only approve new overtimes");

  const state = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved overtime state is missing from the server!");

  overtime = await Overtime.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(overtime);
});

router.post("/revert/:id", admin, async (req, res) => {
  let overtime = await Overtime.findById(req.params.id);
  if (overtime.state.name !== "Approved")
    return res.status(400).send("You can only revert approved overtimes");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The new overtime state is missing from the server!");

  overtime = await Overtime.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(overtime);
});

router.post("/cancel/:id", admin, async (req, res) => {
  let overtime = await Overtime.findById(req.params.id);
  if (overtime.state.name == "Closed")
    return res.status(400).send("You can't cancel closed overtimes");

  const state = await State.findOne({ name: "Canceled" });
  if (!state)
    return res
      .status(500)
      .send("The canceled overtime state is missing from the server!");

  overtime = await Overtime.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(overtime);
});

module.exports = router;
