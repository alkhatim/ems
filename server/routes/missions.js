const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const admin = require("../middleware/admin");
const { Mission, validate } = require("../models/Mission");
const { Employee } = require("../models/Employee");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { MissionState } = require("../models/MissionState");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.employees.filter(e => e.isHead == true).length !== 1)
    return res
      .status(400)
      .send("You must choose one employee to head the mission");

  const employees = [];

  for (const employee of req.body.employees) {
    if (!mongoose.Types.ObjectId.isValid(employee._id))
      return res.status(404).send("One of the given employee IDs is not valid");

    const employeeFromDb = await Employee.findById(employee._id).select("name");
    if (!employeeFromDb)
      return res
        .status(404)
        .send(`The employee with the ID ${employee._id} "doesn't exist`);

    employee.name = employeeFromDb.name;
    employees.push(employee);
  }

  const state = await MissionState.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default mission state if missing from the server!");

  const mission = new Mission({
    destination: req.body.destination,
    notes: req.body.notes,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    expenses: req.body.expenses,
    state,
    employees
  });

  await mission.save();

  res.status(201).send(mission);
});

router.get("/", async (req, res) => {
  const missions = await Mission.find(req.query);
  res.status(200).send(missions);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission)
    return res.status(404).send("There is no mission with the given ID");
  res.status(200).send(mission);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let mission = await Mission.findById(req.params.id);
  if (!mission)
    return res.status(404).send("There is no mission with the given ID");

  if (mission.state.name !== "New")
    return res.status(400).send("You can only modify new missions");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.employees.filter(e => e.isHead == true).length !== 1)
    return res
      .status(400)
      .send("You must choose one employee to head the mission");

  const employees = [];

  for (const employee of req.body.employees) {
    if (!mongoose.Types.ObjectId.isValid(employee._id))
      return res.status(404).send(`The ID ${employee._id} isn't valid`);

    const employeeFromDb = await Employee.findById(employee._id).select("name");
    if (!employeeFromDb)
      return res
        .status(404)
        .send(`The employee with the ID ${employee._id} doesn't exist`);

    employee.name = employeeFromDb.name;
    employees.push(employee);
  }

  const state = mission.state;

  mission = {
    destination: req.body.destination,
    notes: req.body.notes,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    expenses: req.body.expenses,
    state,
    employees
  };

  mission = await Mission.findByIdAndUpdate(req.params.id, mission, {
    new: true
  });

  res.status(200).send(mission);
});

router.delete("/:id", admin, validateObjectId, async (req, res) => {
  const mission = await Mission.findById(req.params.id.select("state"));
  if (!mission)
    return res.status(404).send("There is no mission with the given ID");

  if (mission.state.name == "Closed")
    return res.status(400).send("You can't delete closed missions");

  await Mission.findByIdAndDelete(req.params.id);

  res.status(200).send(mission);
});

// states
router.post("/approve/:id", admin, async (req, res) => {
  let mission = await Mission.findById(req.params.id);
  if (mission.state.name !== "New")
    return res.status(400).send("You can only approve new missions");

  const state = await MissionState.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved mission state is missing from the server!");

  mission = await Mission.findByIdAndUpdate(
    req.params.id,
    { state },
    {
      new: true
    }
  );

  if (mission.startDate <= new Date()) {
    const employeeMissionStatus = await EmployeeStatus.findOne({
      name: "Mission"
    });
    for (const employee of mission.employees) {
      await Employee.findByIdAndUpdate(employee._id, {
        status: employeeMissionStatus
      });
    }
  }

  res.status(200).send(mission);
});

router.post("/revert/:id", admin, async (req, res) => {
  let mission = await Mission.findById(req.params.id);
  if (mission.state.name !== "Approved")
    return res.status(400).send("You can only revert apporved missions");

  const state = await MissionState.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The new mission state is missing from the server!");

  mission = await Mission.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(mission);
});

router.post("/finish/:id", admin, async (req, res) => {
  let mission = await Mission.findById(req.params.id);
  if (mission.state.name !== "Ongoing")
    return res.status(400).send("You can only finish ongoing missions");

  if (req.body.actualEndDate < mission.startDate)
    return res.status(400).send("The end date can't be before the start date");

  const state = await MissionState.findOne({ name: "Finished" });
  if (!state)
    return res
      .status(500)
      .send("The finished mission state is missing from the server!");

  mission = await Mission.findByIdAndUpdate(
    req.params.id,
    {
      state,
      actualExpenses: req.body.actualExpenses,
      actualEndDate: req.body.actualEndDate
    },
    { new: true }
  );

  const employeeNormalStatus = await EmployeeStatus.findOne({
    name: "Normal"
  });
  for (const employee in mission.employees) {
    await Employee.findByIdAndUpdate(employee._id, {
      status: employeeNormalStatus
    });
  }

  res.status(200).send(mission);
});

router.post("/cancel/:id", admin, async (req, res) => {
  let mission = await Mission.findById(req.params.id);
  if (mission.state.name == "Closed" || mission.state.name == "Finished")
    return res.status(400).send("You can't cancel closed or finished missions");

  const state = await MissionState.findOne({ name: "Canceled" });
  if (!state)
    return res
      .status(500)
      .send("The canceled mission state is missing from the server!");

  mission = await Mission.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(mission);
});

module.exports = router;
