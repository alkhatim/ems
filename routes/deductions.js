const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Deduction, validate } = require("../models/Deduction");
const { Employee } = require("../models/Employee");
const { DeductionType } = require("../models/DeductionType");
const { State } = require("../models/State");
const validateObjectId = require("../middleware/validateObjectId");
const config = require("config");

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
      .send("The default deductions state is missing from the server!");

  const type = await DeductionType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  switch (type.name) {
    case "Late":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.basicSalary / (30 * config.get("dailyHours")));
      break;
    case "Absence":
      req.body.total = req.body.amount * (employee.salaryInfo.basicSalary / 30);
      break;
  }

  const deduction = new Deduction({
    employee: _.pick(employee, ["_id", "name"]),
    date: req.body.date,
    notes: req.body.notes,
    state,
    type,
    amount: req.body.amount,
    total: req.body.total
  });

  await deduction.save();

  res.status(201).send(deduction);
});

router.get("/", async (req, res) => {
  const deductions = await Deduction.find(req.query);
  res.status(200).send(deductions);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const deduction = await Deduction.findById({ _id: req.params.id });
  if (!deduction)
    return res.status(404).send("There is no deduction with the given ID");
  res.status(200).send(deduction);
});

router.put("/:id", async (req, res) => {
  let deduction = await Deduction.findById(req.params.id);
  if (!deduction)
    return res.status(404).send("There is no deduction with the given ID");

  if (deduction.state.name != "New")
    return res.status(400).send("You can only modify new deductions");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name salaryInfo"
  );

  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const state = deduction.state;

  const type = await DeductionType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  switch (type.name) {
    case "Late":
      req.body.total =
        req.body.amount *
        (employee.salaryInfo.basicSalary / (30 * config.get("dailyHours")));
      break;
    case "Absence":
      req.body.total = req.body.amount * (employee.salaryInfo.basicSalary / 30);
      break;
  }

  deduction = {
    employee: _.pick(employee, ["_id", "name"]),
    date: req.body.date,
    notes: req.body.notes,
    state,
    type,
    amount: req.body.amount,
    total: req.body.total
  };

  deduction = await Deduction.findByIdAndUpdate(req.params.id, deduction, {
    new: true
  });

  res.status(200).send(deduction);
});

// for changing a deduction's state
router.patch("/:id", validateObjectId, async (req, res) => {
  let deduction = await Deduction.findById(req.params.id);
  if (!deduction)
    return res.status(404).send("There is no deduction with the given ID");

  const state = await State.findById(req.body.stateId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  if (state.name == "Closed" && deduction.state.name != "Approved")
    return res.status(400).send("You can't close an un-approved deduction");

  if (deduction.state.name == "Closed")
    return res.status(400).send("You can't change a closed deduction");

  deduction.state = state;
  await deduction.save();

  res.status(200).send(deduction);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const deduction = await Deduction.findById(req.params.id);
  if (!deduction)
    return res.status(404).send("There is no deduction with the given ID");

  if (deduction.state.name == "Closed")
    return res.status(400).send("You can't delete closed deductions");

  await Deduction.findByIdAndDelete(req.params.id);

  res.status(200).send(deduction);
});

module.exports = router;
