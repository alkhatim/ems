const express = require("express");
const router = express.Router();
const _ = require("lodash");
const config = require("config");
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
        (employee.salaryInfo.basicSalary / (30 * config.get("dailyHours"))) *
        config.get("overtimeFactor");
      break;
    case "Days":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.basicSalary / 30) *
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
  const overtimes = await Overtime.find();
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

  if ((overtime, state.name != "New"))
    return res
      .status(400)
      .send(
        "You can't modify an overtime that has been approved, resolved or canceled"
      );

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name salaryInfo"
  );

  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const state = overtime.state;

  const type = await OvertimeType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  switch (type.name) {
    case "Hours":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.basicSalary / (30 * config.get("dailyHours"))) *
        config.get("overtimeFactor");
      break;
    case "Days":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.basicSalary / 30) *
        config.get("overtimeFactor");
      break;
  }

  overtime = {
    employee: _.pick(employee, ["_id", "name"]),
    date: req.body.date,
    notes: req.body.notes,
    state,
    type,
    amount: req.body.amount,
    total: req.body.total
  };

  await Overtime.findByIdAndUpdate(req.params.id, overtime);

  res.status(200).send(overtime);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const overtime = await Overtime.findByIdAndDelete({ _id: req.params.id });
  if (!overtime)
    return res.status(404).send("There is no overtime with the given ID");

  res.status(200).send(overtime);
});

// for changing an overtime's state
router.patch("/:id", validateObjectId, async (req, res) => {
  const state = await State.findById(req.body.stateId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  const overtime = await Overtime.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  if (!overtime)
    return res.status(404).send("There is no overtime with the given ID");

  res.status(200).send(overtime);
});

module.exports = router;
