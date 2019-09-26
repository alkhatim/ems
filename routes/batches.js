const express = require("express");
const router = express.Router();
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;
const { Batch, validate } = require("../models/Batch");
const { Employee } = require("../models/Employee");
const { BatchType } = require("../models/BatchType");
const { State } = require("../models/State");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Loan } = require("../models/Loan");
const { InstallmentState } = require("../models/InstallmentState");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employees = [];
  const calculatedEmployees = [];
  const toBeResolved = {
    overtimes: [],
    deductions: [],
    installments: []
  };
  req.body.entries = {
    overtimes: [],
    deductions: [],
    installments: []
  };

  //specificly selected employees
  if (req.body.employees) {
    for (id of req.body.employees) {
      if (!ObjectId.isValid(id))
        return res.status(404).send("One of the given Ids is not valdid");
      const employee = await Employee.findById(id).select("name salaryInfo");
      if (employee) employees.push(employee);
    }
  }

  //employees by department
  if (req.body.departmentId) {
    const departmentEmployees = await Employee.find({
      "jobInfo.department._id": req.body.departmentId
    }).select("name salaryInfo");
    departmentEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }

  //employees by location
  if (req.body.locationId) {
    const locationEmployees = await Employee.find({
      "jobInfo.location._id": req.body.locationId
    }).select("name salaryInfo");
    locationEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }

  const type = await BatchType.findById(req.body.typeId);
  if (!type)
    return res.status(404).send("There is no batch type with the given ID");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default batch state is missing from the server!");

  req.body.total = 0;

  if (employees.length == 0)
    return res.status(400).send("There is no employees in this batch");

  //calculate salary foreach employee
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
        // to resolve
        toBeResolved.overtimes.push(overtime);
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
        // to resolve
        toBeResolved.deductions.push(deduction);
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
      toBeResolved.installments.push(installment);
    }

    //total
    newEmployee.details.total =
      newEmployee.details.totalSalary +
      (newEmployee.details.overtimes || 0) -
      (newEmployee.details.deductions || 0) -
      (newEmployee.details.loan || 0);

    calculatedEmployees.push(newEmployee);
    req.body.total += newEmployee.details.total;
  }

  //add entries to batch
  for (overtime of toBeResolved.overtimes) {
    req.body.entries.overtimes.push(overtime._id);
  }

  for (deduction of toBeResolved.deductions) {
    req.body.entries.deductions.push(deduction._id);
  }

  for (installment of toBeResolved.installments) {
    req.body.entries.installments.push(installment._id);
  }

  const batch = new Batch({
    notes: req.body.notes,
    date: req.body.date,
    type,
    state,
    total: req.body.total,
    employees: calculatedEmployees,
    entries: req.body.entries
  });

  await batch.save();
  res.status(201).send(batch);

  //#region resolve batch entries
  const resolvedState = await State.findOne({ name: "Resolved" });
  if (!state)
    return res
      .status(500)
      .send("The resolved state is missing from the server!");

  const installmentResolvedState = await InstallmentState.findOne({
    name: "Resolved"
  });
  if (!state)
    return res
      .status(500)
      .send("The resolved loans state is missing from the server!");

  for (overtime of toBeResolved.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: resolvedState });
  }

  for (deduction of toBeResolved.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: resolvedState });
  }

  for (installment of toBeResolved.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentResolvedState;
    await loan.save();
  }
  //#endregion
});

router.get("/", async (req, res) => {
  const batches = await Batch.find(req.query);
  res.status(200).send(batches);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch)
    return res.status(404).send("There is no batch with the given ID");

  res.status(200).send(batch);
});

module.exports = router;
