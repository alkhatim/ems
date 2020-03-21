const express = require("express");
const router = express.Router();
const moment = require("moment");
const admin = require("../middleware/admin");
const { Vacation, validate } = require("../models/Vacation");
const { Employee } = require("../models/Employee");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { VacationType } = require("../models/VacationType");
const { VacationState } = require("../models/VacationState");
const { VacationCredit } = require("../models/VacationCredit");
const validateObjectId = require("../middleware/validateObjectId");

//credits
router.get("/credits/", async (req, res) => {
  const credit = await VacationCredit.find(req.query);
  res.status(200).send(credit);
});

router.get("/credits/:id", validateObjectId, async (req, res) => {
  const credit = await VacationCredit.findOne({
    "employee._id": req.params.id
  });
  if (!credit)
    return res.status(404).send("There is no credit for this employee");

  res.status(200).send(credit);
});

//vacations
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const type = await VacationType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  if (type.name == "Purchase") {
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

    const vacation = new Vacation({
      employee,
      duration: req.body.duration,
      notes: req.body.notes,
      state,
      type
    });

    await vacation.save();

    credit.remainingCredit -= req.body.duration;
    credit.soldCredit += req.body.duration;
    await credit.save();

    res.status(201).send(vacation);
  } else {
    if (!req.body.startDate)
      return res.status(400).send("You must provide a start date");

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
        .send("The employee already has a vacation at the same time");

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

    const vacation = new Vacation({
      employee,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      duration: req.body.duration,
      notes: req.body.notes,
      state,
      type
    });

    vacation.replacementEmployee = await Employee.findById(
      req.body.replacementEmployeeId
    ).select("_id name");

    await vacation.save();

    credit.remainingCredit -= req.body.duration;
    credit.consumedCredit += req.body.duration;
    await credit.save();

    res.status(201).send(vacation);
  }
});

router.get("/", async (req, res) => {
  const vacations = await Vacation.find(req.query);
  res.status(200).send(vacations);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const vacation = await Vacation.findById(req.params.id);
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  res.status(200).send(vacation);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");
  if (vacation.state.name !== "New")
    return res.status(400).send("You can only modify new vacations");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const type = await VacationType.findById(req.body.typeId);
  if (!type) return res.status(400).send("There is no type with the given ID");

  if (type.name == "Purchase") {
    const credit = await VacationCredit.findOne({
      "employee._id": req.body.employeeId
    });

    credit.remainingCredit += vacation.duration;
    credit.soldCredit -= vacation.duration;

    if (credit.remainingCredit < req.body.duration)
      return res
        .status(400)
        .send("The employee doesn't have enough vacations credit");

    vacation = {
      employee,
      duration: req.body.duration,
      notes: req.body.notes,
      state: vacation.state,
      type
    };

    vacation = await vacation.findByIdAndUpdate(req.params.id, vacation, {
      new: true
    });

    credit.remainingCredit -= req.body.duration;
    credit.soldCredit += req.body.duration;
    await credit.save();

    res.status(200).send(vacation);
  } else {
    if (!req.body.startDate)
      return res.status(400).send("You must provide a start date");

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
        .send("The employee already has a vacation at the same time");

    const credit = await VacationCredit.findOne({
      "employee._id": req.body.employeeId
    });

    credit.remainingCredit += vacation.duration;
    credit.consumedCredit -= vacation.duration;

    if (credit.remainingCredit < req.body.duration)
      return res
        .status(400)
        .send("The employee doesn't have enough vacations credit");

    const state = await VacationState.findOne({ name: "New" });
    if (!state)
      return res
        .status(500)
        .send("The default vacation state is missing from the server!");

    vacation = {
      employee,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      duration: req.body.duration,
      notes: req.body.notes,
      state,
      type
    };

    vacation.replacementEmployee = await Employee.findById(
      req.body.replacementEmployeeId
    ).select("_id name");

    vacation = await Vacation.findByIdAndUpdate(req.params.id, vacation, {
      new: true
    });

    credit.remainingCredit -= req.body.duration;
    credit.consumedCredit += req.body.duration;
    await credit.save();

    res.status(200).send(vacation);
  }
});

router.delete("/:id", admin, validateObjectId, async (req, res) => {
  const vacation = await Vacation.findById(req.params.id).select("state");
  if (!vacation)
    return res.status(404).send("There is no vacation with the given ID");

  if (vacation.state.name == "Ongoing")
    return res.status(400).send("You can't delete an ongoing vacation");

  await Vacation.findByIdAndDelete(req.params.id);

  res.status(200).send(vacation);
});

//states
router.post("/approve/:id", admin, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (vacation.state.name !== "New")
    return res.status(400).send("You can only approve new vacations");

  const state = await VacationState.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved vacation state is missing from the server!");

  vacation = await Vacation.findByIdAndUpdate(
    req.params.id,
    { state },
    {
      new: true
    }
  );

  if (vacation.startDate <= new Date()) {
    const employeeVacationStatus = await EmployeeStatus.findOne({
      name: "Vacation"
    });
    await Employee.findByIdAndUpdate(vacation.employee._id, {
      status: employeeVacationStatus
    });
  }

  res.status(200).send(vacation);
});

router.post("/revert/:id", admin, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (vacation.state.name !== "Approved")
    return res.status(400).send("You can only revert apporved vacations");

  const state = await VacationState.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The new vacation state is missing from the server!");

  vacation = await Vacation.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(vacation);
});

router.post("/cutoff/:id", admin, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (vacation.state.name !== "Ongoing")
    return res.status(400).send("You can only cutoff ongoing vacations");

  if (!req.body.actualEndDate)
    return res.status(400).send("You must select a cutoff date");

  if (vacation.endDate < req.body.actualEndDate)
    return res
      .status(400)
      .send("The cutoff date must be before the schedueld end date");

  const state = await VacationState.findOne({ name: "Cutoff" });
  if (!state)
    return res
      .status(500)
      .send("The cutoff vacation state is missing from the server!");

  const employeeNormalStatus = await EmployeeStatus.findOne({ name: "Normal" });

  const credit = await VacationCredit.findOne({
    "employee._id": vacation.employee._id
  });
  credit.remainingCredit += moment(vacation.endDate).diff(
    req.body.actualEndDate,
    "d"
  );
  await credit.save();

  await Employee.findByIdAndUpdate(vacation.employee._id, {
    status: employeeNormalStatus
  });

  vacation = await Vacation.findByIdAndUpdate(
    req.params.id,
    {
      state,
      actualEndDate: req.body.actualEndDate
    },
    { new: true }
  );
  res.status(200).send(vacation);
});

router.post("/cancel/:id", admin, async (req, res) => {
  let vacation = await Vacation.findById(req.params.id);
  if (vacation.state.name == "Ongoing")
    return res.status(400).send("You can't cancel ongoing vacations");

  const state = await VacationState.findOne({ name: "Canceled" });
  if (!state)
    return res
      .status(500)
      .send("The canceled vacation state is missing from the server!");

  vacation = await Vacation.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(vacation);
});

module.exports = router;
