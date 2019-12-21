const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Employee, validate } = require("../models/Employee");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { TerminatedEmployee } = require("../models/TerminatedEmployee");
const { Gender } = require("../models/Gender");
const { Nationality } = require("../models/Nationality");
const { Contract } = require("../models/Contract");
const { Job } = require("../models/Job");
const { Department } = require("../models/Department");
const { Location } = require("../models/Location");
const { Loan } = require("../models/Loan");
const { VacationCredit } = require("../models/VacationCredit");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const gender = await Gender.findById(req.body.genderId);
  if (!gender)
    return res.status(404).send("The specified gender was not found");

  const nationality = await Nationality.findById(req.body.nationalityId);
  if (!nationality)
    return res.status(404).send("The specified nationality was not found");

  const contract = await Contract.findById(req.body.contractId);
  if (!contract)
    return res.status(404).send("The specified contract was not found");

  const status = await EmployeeStatus.findOne({ name: "Normal" });
  if (!status)
    return res
      .status(500)
      .send("The default employee state is missing from the database!");

  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("The specified job was not found");

  const department = await Department.findById(req.body.departmentId);
  if (!department)
    return res.status(404).send("The specified department was not found");

  const location = await Location.findById(req.body.locationId);
  if (!location)
    return res.status(404).send("The specified location was not found");

  const employee = new Employee({
    name: req.body.name,
    gender,
    nationality,
    birthday: req.body.birthday,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    bankAccount: req.body.bankAccount,
    status,
    jobInfo: {
      job,
      contract,
      department,
      location,
      dateOfEmployment: req.body.dateOfEmployment,
      contractExpiryDate: req.body.contractExpiryDate
    },
    salaryInfo: {
      basicSalary: req.body.basicSalary,
      livingExpenseAllowance: req.body.livingExpenseAllowance,
      housingAllowance: req.body.housingAllowance,
      transportAllowance: req.body.transportAllowance,
      foodAllowance: req.body.foodAllowance,
      totalSalary:
        req.body.basicSalary +
        (req.body.housingAllowance || 0) +
        (req.body.livingExpenseAllowance || 0) +
        (req.body.transportAllowance || 0) +
        (req.body.foodAllowance || 0)
    },
    socialInsuranceInfo: {
      registered: req.body.registered,
      socialInsuranceNumber: req.body.socialInsuranceNumber,
      socialInsuranceSalary: req.body.socialInsuranceSalary
    },
    vacationInfo: {
      vacationDays: req.body.vacationDays,
      vacationSchedule: req.body.vacationSchedule
    }
  });

  if (req.body.vacationDays) {
    const vacationCredit = new VacationCredit({
      employee: _.pick(employee, ["_id", "name"]),
      totalCredit: req.body.vacationDays,
      remainingCredit: req.body.vacationDays
    });
    await vacationCredit.save();
  }

  await employee.save();
  res.status(201).send(employee);
});

router.get("/", async (req, res) => {
  const employees = await Employee.find(req.query).select(
    "-salaryInfo -serviceInfo -socialInsuranceInfo -vacationInfo"
  );
  res.status(200).send(employees);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const employee = await Employee.findById({ _id: req.params.id });
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");
  res.status(200).send(employee);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let employee = await Employee.findById(req.params.id);
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  if (employee.status.name == "Terminated")
    return res
      .status(400)
      .send("You can't modify an employee that has been terminated");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const gender = await Gender.findById(req.body.genderId);
  if (!gender)
    return res.status(404).send("The specified gender was not found");

  const nationality = await Nationality.findById(req.body.nationalityId);
  if (!nationality)
    return res.status(404).send("The specified nationality was not found");

  const contract = await Contract.findById(req.body.contractId);
  if (!contract)
    return res.status(404).send("The specified contract was not found");

  const status = employee.status;

  const job = await Job.findById(req.body.jobId);
  if (!job) return res.status(404).send("The specified job was not found");

  const department = await Department.findById(req.body.departmentId);
  if (!department)
    return res.status(404).send("The specified department was not found");

  const location = await Location.findById(req.body.locationId);
  if (!location)
    return res.status(404).send("The specified location was not found");

  if (!employee.vacationInfo.vacationDays && req.body.vacationDays) {
    const vacationCredit = new VacationCredit({
      employee: _.pick(employee, ["_id", "name"]),
      totalCredit: req.body.vacationDays,
      remainingCredit: req.body.vacationDays
    });

    await vacationCredit.save();
  }

  if (employee.vacationInfo.vacationDays && req.body.vacationDays) {
    const vacationCredit = await VacationCredit.findOne({
      "employee._id": employee._id
    });
    const usedCredit =
      vacationCredit.totalCredit - vacationCredit.remainingCredit;
    const remainingCredit =
      req.body.vacationDays >= usedCredit
        ? req.body.vacationDays - usedCredit
        : 0;

    vacationCredit.totalCredit = req.body.vacationDays;
    vacationCredit.remainingCredit = remainingCredit;

    await vacationCredit.save();
  }

  employee = {
    name: req.body.name,
    gender,
    nationality,
    birthday: req.body.birthday,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    bankAccount: req.body.bankAccount,
    status,
    jobInfo: {
      job,
      contract,
      department,
      location,
      dateOfEmployment: req.body.dateOfEmployment,
      contractExpiryDate: req.body.contractExpiryDate
    },
    salaryInfo: {
      basicSalary: req.body.basicSalary,
      livingExpenseAllowance: req.body.livingExpenseAllowance,
      housingAllowance: req.body.housingAllowance,
      transportAllowance: req.body.transportAllowance,
      foodAllowance: req.body.foodAllowance,
      totalSalary:
        req.body.basicSalary +
        (req.body.housingAllowance || 0) +
        (req.body.livingExpenseAllowance || 0) +
        (req.body.transportAllowance || 0) +
        (req.body.foodAllowance || 0)
    },
    socialInsuranceInfo: {
      registered: req.body.registered,
      socialInsuranceNumber: req.body.number,
      socialInsuranceSalary: req.body.socialInsuranceSalary
    },
    vacationInfo: {
      vacationDays: req.body.vacationDays,
      vacationSchedule: req.body.vacationSchedule
    }
  };

  employee = await Employee.findByIdAndUpdate(req.params.id, employee, {
    new: true
  });
  res.status(200).send(employee);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  if (
    await Loan.findOne({
      "employee._id": req.params.id,
      "installments.state.name": "Pending"
    }).select("_id")
  )
    return res
      .status(400)
      .send("You can't delete an employee with an unclosed loan");

  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");
  res.status(200).send(employee);
});

// status
router.post("/terminate/:id", async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (employee.status.name == "Terminated")
    return res.status(400).send("This employee is already terminated");

  const status = await EmployeeStatus.findOne({ name: "Terminated" });
  if (!status)
    return res
      .status(500)
      .send("The terminated employee status is missing from the server!");

  employee.status = status;
  employee.serviceInfo.endOfServiceDate = req.body.endOfServiceDate;
  employee.serviceInfo.endOfServiceReason = req.body.endOfServiceReason;

  const terminatedEmployee = new TerminatedEmployee(employee);
  terminatedEmployee.isNew = true;
  await terminatedEmployee.save();

  employee.remove();

  res.status(200).send(employee);
});

router.post("/unterminate/:id", async (req, res) => {
  const terminatedEmployee = await TerminatedEmployee.findById(req.params.id);

  const status = await EmployeeStatus.findOne({ name: "Normal" });
  if (!status)
    return res
      .status(500)
      .send("The normal employee status is missing from the server!");

  terminatedEmployee.status = status;
  terminatedEmployee.serviceInfo.endOfServiceDate = null;
  terminatedEmployee.serviceInfo.endOfServiceReason = null;

  const employee = new Employee(terminatedEmployee);
  employee.isNew = true;
  await employee.save();

  terminatedEmployee.remove();

  res.status(200).send(terminatedEmployee);
});

module.exports = router;
