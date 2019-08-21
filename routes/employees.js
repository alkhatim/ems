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
const { EndOfServiceReason } = require("../models/EndOfServiceReason");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.genderId)
    req.body.gender = await Gender.findById(req.body.genderId);
  if (req.body.nationalityId)
    req.body.nationality = await Nationality.findById(req.body.nationalityId);
  if (req.body.contractId)
    req.body.contract = await Contract.findById(req.body.contractId);
  if (req.body.statusId)
    req.body.status = await EmployeeStatus.findById(req.body.statusId);
  if (req.body.jobId) req.body.job = await Job.findById(req.body.jobId);
  if (req.body.departmentID)
    req.body.department = await Department.findById(req.body.departmentId);
  if (req.body.endOfserviceId)
    req.body.endOfServiceReason = await EndOfServiceReason.findById(
      req.body.endOfServiceReasonId
    );

  const employee = new Employee({
    name: req.body.name,
    gender: req.body.gender,
    nationality: req.body.nationality,
    birthday: req.body.birthday,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    bankAccount: req.body.bankAccount,
    contract,
    status,
    jobInfo: {
      job: req.body.job,
      department: req.body.department,
      dateOfEmployment: req.body.dateOfEmployment,
      contractExpiryDate: req.body.contractExpiryDate
    },
    salaryInfo: {
      basicSalary: req.body.basicSalary,
      livingExpenseAllowance: req.body.livingExpenseAllowance,
      housingAllowance: req.body.housingAllowance,
      transportAllowance: req.body.transportAllowance,
      foodAllowance: req.body.foodAllowance
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

  try {
    await employee.save();
  } catch (e) {
    console.log(e);
  }

  return res.status(201).send(employee);
});

module.exports = router;
