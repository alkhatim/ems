const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Batch, validate } = require("../models/Batch");
const { Employee } = require("../models/Employee");
const { BatchType } = require("../models/BatchType");
const { State } = require("../models/State");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Loan } = require("../models/Loan");
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
    newEmployee.details = {};

    //salary
    newEmployee.details.basicSalary = employee.salaryInfo.basicSalary;

    if (employee.salaryInfo.livingExpenseAllowance)
      newEmployee.details.livingExpenseAllowance =
        employee.salaryInfo.livingExpenseAllowance;

    if (employee.salaryInfo.livingExpenseAllowance)
      newEmployee.details.livingExpenseAllowance =
        employee.salaryInfo.livingExpenseAllowance;

    if (employee.salaryInfo.housingAllowance)
      newEmployee.details.housingAllowance =
        employee.salaryInfo.housingAllowance;

    if (employee.salaryInfo.transportAllowance)
      newEmployee.details.transportAllowance =
        employee.salaryInfo.transportAllowance;

    if (employee.salaryInfo.foodAllowance)
      newEmployee.details.foodAllowance = employee.salaryInfo.foodAllowance;

    newEmployee.details.totalSalary = employee.salaryInfo.totalSalary;

    // overtimes
    const overtimes = await Overtime.find({
      "employee._id": employee._id,
      date: { $lt: req.body.date },
      "state.name": { $eq: "Approved" }
    });
    if (overtimes) {
      newEmployee.details.overtimes = 0;
      overtimes.forEach(overtime => {
        newEmployee.details.overtimes += overtime.total;
      });
    }

    // deductions
    const deductions = await Deduction.find({
      "employee._id": employee._id,
      date: { $lt: req.body.date },
      "state.name": { $eq: "Approved" }
    });
    if (deductions) {
      newEmployee.details.deductions = 0;
      deductions.forEach(deduction => {
        newEmployee.details.deductions += deduction.total;
      });
    }

    // loan
    const loan = await Loan.findOne({
      "employee._id": employee._id,
      "installments.state.name": "Pending",
      "installments.date": moment(req.body.date)
        .endOf("month")
        .toDate()
    });
    if (loan) {
      const installment = loan.installments.find(
        i =>
          i.state.name == "Pending" &&
          i.date.getMonth() == new Date(req.body.date).getMonth()
      );

      newEmployee.details.loan = installment.amount;
    }

    //total
    newEmployee.details.total =
      newEmployee.details.totalSalary +
      (newEmployee.details.overtimes || 0) -
      (newEmployee.details.deductions || 0) -
      (newEmployee.details.loan || 0);

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
