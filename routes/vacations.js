const express = require("express");
const router = express.Router();
const { Vacation, validate } = require("../models/Vacation");
const { Employee } = require("../models/Employee");
const { VacationType } = require("../models/VacationType");
const { VacationState } = require("../models/VacationState");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name vacationInfo"
  );

  if (!employee)
    return res.status(400).send("There is no employee with the given ID");

  const state = await VacationState.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default vacation state is missing from the server!");

  const type = await VacationType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");
});

router.get("/", async (req, res) => {
  const vacations = await Vacation.find();
  return res.status(200).send(vacations);
});
