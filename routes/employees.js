const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Employee, validate } = require("../models/Employee");
const { Gender } = require("../models/Gender");
const { Nationality } = require("../models/Nationality");
const { Contract } = require("../models/Contract");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { Job } = require("../models/Job");
const { Department } = require("../models/Department");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.gender = await Gender.findById(req.body.genderId);
  if (!req.body.gender)
    return res.status(404).send("The specified gender was not found");

  req.body.nationality = await Nationality.findById(req.body.nationalityId);
  if (!req.body.nationality)
    return res.status(404).send("The specified nationality was not found");

  req.body.contract = await Contract.findById(req.body.contractId);
  if (!req.body.contract)
    return res.status(404).send("The specified contract was not found");

  req.body.status = await EmployeeStatus.findOne({ name: "Normal" });
  if (!req.body.status)
    return res
      .status(500)
      .send("The default employee state is missing from the database!");

  req.body.job = await Job.findById(req.body.jobId);
  if (!req.body.job)
    return res.status(404).send("The specified job was not found");

  req.body.department = await Department.findById(req.body.departmentId);
  if (!req.body.department)
    return res.status(404).send("The specified department was not found");

  const employee = new Employee({
    name: req.body.name,
    gender: req.body.gender,
    nationality: req.body.nationality,
    birthday: req.body.birthday,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    bankAccount: req.body.bankAccount,
    status: req.body.status,
    jobInfo: {
      job: req.body.job,
      contract: req.body.contract,
      department: req.body.department,
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
    serviceInfo: {
      endOfServiceDate: req.body.endOfServiceDate,
      endOfServiceReason: req.body.endOfServiceReason,
      suspensionDate: req.body.suspensionDate,
      suspensionReason: req.body.suspensionReason
    },
    vacationInfo: {
      vacationDays: req.body.vacationDays,
      vacationSchedule: req.body.vacationSchedule
    }
  });

  await employee.save();
  return res.status(201).send(employee);
});

router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.status(200).send(employees);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const employee = await Employee.findById({ _id: req.params.id });
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");
  res.status(200).send(employee);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const employee = await Employee.findByIdAndDelete({ _id: req.params.id });
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");
  res.status(200).send(employee);
});

router.put("/:id", validateObjectId, async (req, res) => {
  const status = await Employee.findById(req.params.id).select("status");
  if (status.name == "Terminated")
    return res
      .status(400)
      .send("You can't modify an employee that's not working here anymore");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.gender = await Gender.findById(req.body.genderId);
  if (!req.body.gender)
    return res.status(404).send("The specified gender was not found");

  req.body.nationality = await Nationality.findById(req.body.nationalityId);
  if (!req.body.nationality)
    return res.status(404).send("The specified nationality was not found");

  req.body.contract = await Contract.findById(req.body.contractId);
  if (!req.body.contract)
    return res.status(404).send("The specified contract was not found");

  req.body.status = await EmployeeStatus.findById(req.body.statusId);
  if (!req.body.status)
    return res.status(404).send("The specified status was not found");

  req.body.job = await Job.findById(req.body.jobId);
  if (!req.body.job)
    return res.status(404).send("The specified job was not found");

  req.body.department = await Department.findById(req.body.departmentId);
  if (!req.body.department)
    return res.status(404).send("The specified department was not found");

  const employee = {
    name: req.body.name,
    gender: req.body.gender,
    nationality: req.body.nationality,
    birthday: req.body.birthday,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    bankAccount: req.body.bankAccount,
    status: req.body.status,
    jobInfo: {
      job: req.body.job,
      contract: req.body.contract,
      department: req.body.department,
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
    serviceInfo: {
      endOfServiceDate: req.body.endOfServiceDate,
      endOfServiceReason: req.body.endOfServiceReason,
      suspensionDate: req.body.suspensionDate,
      suspensionReason: req.body.suspensionReason
    },
    vacationInfo: {
      vacationDays: req.body.vacationDays,
      vacationSchedule: req.body.vacationSchedule
    }
  };

  await Employee.findByIdAndUpdate(req.params.id, employee);
  return res.status(200).send(employee);
});

// for changing an employee's status
router.patch("/:id", validateObjectId, async (req, res) => {
  const status = await EmployeeStatus.findById(req.body.statusId);
  if (!status)
    return res.status(404).send("There is no status with the given ID");

  const employee = await Employee.findByIdAndUpdate(req.params.id, { status });
  res.status(200).send(employee);
});

module.exports = router;
