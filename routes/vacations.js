const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Vacation, validate } = require("../models/Vacation");
const { Employee } = require("../models/Employee");
const { VacationType } = require("../models/VacationType");
const { VacationState } = require("../models/VacationState");
const { VacationCredit } = require("../models/VacationCredit");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  if (req.body.endDate)
    req.body.duration = moment(req.body.endDate).diff(
      moment(req.body.startDate),
      "days"
    );

  const credit = await VacationCredit.findOne({
    "employee._id": req.body.employeeId
  });
  if (!credit)
    return res
      .status(400)
      .send("Register a vacations credit for this employee first");

  if (credit.remainingCredit < req.body.duration)
    return res
      .status(400)
      .send("The employee doesn't have enough vacations credit");

  const state = await VacationState.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default vacation state is missing from the server!");

  const type = await VacationType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  const vacation = new Vacation({
    employee,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    duration: req.body.duration,
    notes: req.body.notes,
    state,
    type
  });

  if (req.body.replacementEmplyeeId)
    vacation.replacementEmplyee = await Employee.findById(
      req.body.replacementEmplyeeId
    ).select("_id name");

  await vacation.save();

  credit.remainingCredit -= req.body.duration;
  await credit.save();
});

router.get("/", async (req, res) => {
  const vacations = await Vacation.find();
  return res.status(200).send(vacations);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const vacation = await Vacation.find({ _id: req.body.id });
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  return res.status(200).send(vacations);
});

module.exports = router;
