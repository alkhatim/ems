const express = require("express");
const router = express.Router();
const { BatchType } = require("../models/BatchType");
const { Contract } = require("../models/Contract");
const { DeductionType } = require("../models/DeductionType");
const { Department } = require("../models/Department");
const { Employee } = require("../models/Employee");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { Gender } = require("../models/Gender");
const { InstallmentState } = require("../models/InstallmentState");
const { Job } = require("../models/Job");
const { LoanState } = require("../models/LoanState");
const { Location } = require("../models/Location");
const { MissionState } = require("../models/MissionState");
const { Nationality } = require("../models/Nationality");
const { OvertimeType } = require("../models/OvertimeType");
const { State } = require("../models/State");
const { VacationState } = require("../models/VacationState");
const { VacationType } = require("../models/VacationType");

router.get("/", async (req, res) => {
  let lookups;
  switch (req.query.lookup) {
    case "BatchType":
      lookups = await BatchType.find();
      res.status(200).send(lookups);
      break;
    case "Contract":
      lookups = await Contract.find();
      res.status(200).send(lookups);
      break;
    case "DeductionType":
      lookups = await DeductionType.find();
      res.status(200).send(lookups);
      break;
    case "Department":
      lookups = await Department.find();
      res.status(200).send(lookups);
      break;
    case "Employee":
      lookups = await Employee.find().select("_id name");
      res.status(200).send(lookups);
      break;
    case "EmployeeStatus":
      lookups = await EmployeeStatus.find();
      res.status(200).send(lookups);
      break;
    case "Gender":
      lookups = await Gender.find();
      res.status(200).send(lookups);
      break;
    case "InstallmentState":
      lookups = await InstallmentState.find();
      res.status(200).send(lookups);
      break;
    case "Job":
      lookups = await Job.find();
      res.status(200).send(lookups);
      break;
    case "LoanState":
      lookups = await LoanState.find();
      res.status(200).send(lookups);
      break;
    case "Location":
      lookups = await Location.find();
      res.status(200).send(lookups);
      break;
    case "MissionState":
      lookups = await MissionState.find();
      res.status(200).send(lookups);
      break;
    case "Nationality":
      lookups = await Nationality.find();
      res.status(200).send(lookups);
      break;
    case "OvertimeType":
      lookups = await OvertimeType.find();
      res.status(200).send(lookups);
      break;
    case "State":
      lookups = await State.find();
      res.status(200).send(lookups);
      break;
    case "VacationState":
      lookups = await VacationState.find();
      res.status(200).send(lookups);
      break;
    case "VacationType":
      lookups = await VacationType.find();
      res.status(200).send(lookups);
      break;

    default:
      res.status(404).send("Not found");
      break;
  }
});

module.exports = router;
