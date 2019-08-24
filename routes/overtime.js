const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Employee, validate } = require("../models/Employee");
const { Overtime, validate } = require("../models/Overtime");
const { OvertimeType, validate } = require("../models/OvertimeType");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.employee = Employee.findById(req.body.employeeId);
  if (!req.body.employee)
    return res.status(400).send("There is no employee with the given ID");

  req.body.type = OvertimeType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  const overtime = new Overtime({
    employee: req.body.employee,
    date: req.body.date,
    notes: req.body.notes,
    state: req.body.state,
    type: req.body.type,
    amount: req.body.amount,
    total: req.body.total
  });

  await overtime.save();

  return res.status(201).send(overtime);
});

module.exports = router;
