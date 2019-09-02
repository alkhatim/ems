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

  req.body.endDate = moment(req.body.startDate)
    .add(req.body.duration, "d")
    .toDate();

  const ongoingVacation = await Vacation.findOne({
    "employee._id": req.body.employeeId
  }).or([
    {
      startDate: { $lte: req.body.startDate },
      endDate: { $gte: req.body.startDate }
    },
    {
      startDate: { $lte: req.body.endDate },
      endDate: { $gte: req.body.endDate }
    }
  ]);

  if (ongoingVacation)
    return res
      .status(400)
      .send(
        "The dates coflict with an already scheduled vactaion for the same employee!"
      );

  const credit = await VacationCredit.findOne({
    "employee._id": req.body.employeeId
  });
  if (credit == null || credit == undefined)
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

  if (req.body.replacementEmployeeId)
    vacation.replacementEmployee = await Employee.findById(
      req.body.replacementEmployeeId
    ).select("_id name");

  await vacation.save();

  credit.remainingCredit -= req.body.duration;
  await credit.save();

  res.status(201).send(vacation);
});

router.get("/", async (req, res) => {
  const vacations = await Vacation.find();
  res.status(200).send(vacations);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const vacation = await Vacation.find({ _id: req.params.id });
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  res.status(200).send(vacations);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const vacation = await Vacation.findById(req.params.id);
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  if (vacation.state.name == "Ongoing")
    return res.status(400).send("You can't delete an ongoing vacation");

  await Vacation.findByIdAndDelete(req.params.id);

  res.status(200).send(vacation);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  if (vacation.state.name != "New")
    return res
      .status(400)
      .send("You can't modify a vacation that has been approved");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  req.body.endDate = moment(req.body.startDate)
    .add(req.body.duration, "d")
    .toDate();

  const ongoingVacation = await Vacation.findOne({
    "employee._id": req.body.employeeId,
    _id: { $ne: vacation._id }
  }).or([
    {
      startDate: { $lte: req.body.startDate },
      endDate: { $gte: req.body.startDate }
    },
    {
      startDate: { $lte: req.body.endDate },
      endDate: { $gte: req.body.endDate }
    }
  ]);

  if (ongoingVacation)
    return res
      .status(400)
      .send(
        "The dates coflict with an already scheduled vactaion for the same employee!"
      );

  const credit = await VacationCredit.findOne({
    "employee._id": req.body.employeeId
  });

  if (credit == null || credit == undefined)
    return res
      .status(400)
      .send("Register a vacations credit for this employee first");

  credit.remainingCredit += vacation.duration;

  if (credit.remainingCredit < req.body.duration)
    return res
      .status(400)
      .send("The employee doesn't have enough vacations credit");

  const state = vacation.state;

  const type = await VacationType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  vacation = {
    employee,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    duration: req.body.duration,
    notes: req.body.notes,
    state,
    type
  };

  if (req.body.replacementEmployeeId)
    vacation.replacementEmployee = await Employee.findById(
      req.body.replacementEmployeeId
    ).select("_id name");

  await Vacation.findByIdAndUpdate(req.params.id, vacation);

  credit.remainingCredit -= req.body.duration;
  await credit.save();

  res.status(200).send(vacation);
});

router.patch("/:id", validateObjectId, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  const state = await VacationState.findById(req.body.stateId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  if (vacation.state.name == "Ongoing" && state.name == "Cutoff") {
    vacation.actualEndDate = new Date().setHours(0, 0, 0, 0);
    let credit = await credit.findOne({
      "employee._id": vacation.employee._id
    });
    credit.remainingCredit += moment(vacation.endDate).diff(moment(), "d");
    credit.save();
  }

  vacation.state = state;

  vacation.save();

  res.status(200).send(vacation);
});

module.exports = router;
