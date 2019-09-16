const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const { Mission, validate } = require("../models/Mission");
const { Employee } = require("../models/Employee");
const { MissionState } = require("../models/MissionState");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.employees.filter(e => e.isHead == true).length != 1)
    return res
      .status(400)
      .send("You must choose one employee to head the mission");

  const employees = [];

  for (employee of req.body.employees) {
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

  if (mission.state.name != "New")
    return res
      .status(400)
      .send("You can't modify a mission that isn't in the New state");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.employees.filter(e => e.isHead == true).length != 1)
    return res
      .status(400)
      .send("You must choose one employee to head the mission");

  const employees = [];

  for (employee of req.body.employees) {
    if (!mongoose.Types.ObjectId.isValid(employee._id))
      return res.status(404).send("One of the given IDs is not valdid");

    const employeeFromDb = await Employee.findById(employee._id).select("name");
    if (!employeeFromDb)
      return res
        .status(404)
        .send(`The employee with the ID ${employee._id} "doesn't exist`);

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

  await Mission.findByIdAndUpdate(req.params.id, mission);
  res.status(200).send(mission);
});

// for changing mission state
router.patch("/:id", validateObjectId, async (req, res) => {
  const state = await MissionState.findById(req.body.stateId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  if (state.name == "Finished") {
    let mission = await Mission.findById(req.params.id).select("state");

    if (mission.state.name != "Approved")
      return res
        .status(400)
        .send("You can only change approved missions to finished");

    mission = await Mission.findByIdAndUpdate(
      req.params.id,
      {
        state,
        actualExpenses: req.body.actualExpenses,
        actualEndDate: req.body.actualEndDate
      },
      {
        new: true
      }
    );
    if (!mission)
      return res.status(404).send("There is no mission with the given ID");

    return res.status(200).send(mission);
  }

  const mission = await Mission.findByIdAndUpdate(
    req.params.id,
    { state },
    {
      new: true
    }
  );
  if (!mission)
    return res.status(404).send("There is no mission with the given ID");

  return res.status(200).send(mission);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const mission = await Mission.findByIdAndDelete(req.params.id);
  if (!mission)
    return res.status(404).send("There is no mission with the given ID");

  res.status(200).send(mission);
});

module.exports = router;
