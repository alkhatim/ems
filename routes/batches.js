const express = require("express");
const router = express.Router();
const { Batch, validate } = require("../models/Batch");
const { Employee } = require("../models/Employee");
const { BatchType } = require("../models/BatchType");
const { State } = require("../models/State");
const calculateEmployeeSalary = require("../helpers/calculateEmployeeSalary");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employees = [];
  req.body.employees = [];

  if (req.body.employees) {
    req.body.employees.forEach(async id => {
      employees.push(await Employee.findById(id).select("name salaryInfo"));
    });
  }

  if (req.body.departmentId) {
    const departmentEmployees = await Employee.find({
      "jobInfo.department._id": req.body.departmentId
    }).select("name salaryInfo");
    departmentEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }

  const type = await BatchType.findById(req.body.typeId);
  if (!type)
    return res.status(404).send("There is no batch type with the given ID");

  const state = await State.findOne({ name: "New" });
  if (!type)
    return res
      .status(500)
      .send("The default batch state is missing from the server!");

  req.body.total = 0;

  for (employee of employees) {
    const newEmployee = {};
    newEmployee._id = employee._id;
    newEmployee.name = employee.name;
    newEmployee.details = await calculateEmployeeSalary(
      employee,
      req.body.date
    );
    req.body.employees.push(newEmployee);
    req.body.total += newEmployee.details.total;
  }

  const batch = new Batch({
    notes: req.body.notes,
    date: req.body.date,
    type,
    state,
    total: req.body.total,
    employees: req.body.employees
  });

  await batch.save();
  res.status(201).send(batch);
});

module.exports = router;
