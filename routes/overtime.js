const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Overtime, validate } = require("../models/Overtime");
const { Employee } = require("../models/Employee");
const { OvertimeType } = require("../models/OvertimeType");
const { State } = require("../models/State");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!req.body.employee)
    return res.status(400).send("There is no employee with the given ID");

  req.body.state = await State.findOne({ name: "New" });
  if (!req.body.state)
    return res
      .status(500)
      .send("The default overtime state is missing from the server!");

  req.body.type = await OvertimeType.findById(req.body.typeId);
  if (!req.body.type)
    return res.status(400).send("There is no type with the given ID");

  const overtime = new Overtime({
    employee: req.body.employee,
    date: req.body.date,
    notes: req.body.notes,
    state: req.body.state,
    type: req.body.type,
    amount: req.body.amount,
    total: req.body.amount
  });

  await overtime.save();

  return res.status(201).send(overtime);
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

module.exports = router;
