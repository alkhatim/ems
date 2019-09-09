const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Batch, validate } = require("../models/Batch");
const { Employee } = require("../models/Employee");
const { BatchType } = require("../models/BatchType");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Loan } = require("../models/Loan");
const { State } = require("../models/State");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employees = [];

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

  const state = await State.findOne({ name: "New" });

  if (type.name == "Salaries") {
    req.body.total = 0;

    employees.forEach(async employee => {
      employee.batchDetails = {};
      // salary
      employee.batchDetails.basicSalary = employee.salaryInfo.basicSalary;

      if (employee.salaryInfo.livingExpenseAllowance)
        employee.batchDetails.livingExpenseAllowance =
          employee.salaryInfo.livingExpenseAllowance;

      if (employee.salaryInfo.livingExpenseAllowance)
        employee.batchDetails.livingExpenseAllowance =
          employee.salaryInfo.livingExpenseAllowance;

      if (employee.salaryInfo.housingAllowance)
        employee.batchDetails.housingAllowance =
          employee.salaryInfo.housingAllowance;

      if (employee.salaryInfo.transportAllowance)
        employee.batchDetails.transportAllowance =
          employee.salaryInfo.transportAllowance;

      if (employee.salaryInfo.foodAllowance)
        employee.batchDetails.foodAllowance = employee.salaryInfo.foodAllowance;

      employee.batchDetails.totalSalary = employee.salaryInfo.totalSalary;

      // overtimes
      const overtimes = await Overtime.find({
        "employee._id": employee._id,
        date: { $lt: req.body.date },
        "state.name": { $eq: "Approved" }
      });
      employee.batchDetails.overtime = 0;
      overtimes.forEach(overtime => {
        employee.batchDetails.overtime += overtime.total;
      });

      // deductions
      const deductions = await Deduction.find({
        "employee._id": employee._id,
        date: { $lt: req.body.date },
        "state.name": { $eq: "Approved" }
      });
      employee.batchDetails.deduction = 0;
      deductions.forEach(deduction => {
        employee.batchDetails.deduction += deduction.total;
      });

      // loan
      const date = moment(req.body.date)
        .endOf("month")
        .toDate();
      const loan = await Loan.findOne({
        "employee._id": employee._id,
        "installments.state.name": "Pending",
        "installments.date": date
      });
      const installment = loan.installments.find(
        i => i.state.name == "Pending"
      );
      employee.batchDetails.loan = installment.amount;

      //total
      employee.batchDetails.total =
        employee.batchDetails.totalSalary +
        employee.batchDetails.overtime -
        employee.batchDetails.deduction -
        employee.batchDetails.loan;
      req.body.total += employee.batchDetails.total;
      console.log(employee.batchDetails);
    });
  }

  const batch = new Batch({
    notes: req.body.notes,
    date: req.body.date,
    type,
    state,
    total: req.body.total,
    employees
  });

  await batch.save();
  res.status(201).send(batch);
});

module.exports = router;
