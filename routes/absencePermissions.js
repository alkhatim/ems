const express = require("express");
const router = express.Router();
const { AbsencePermission, validate } = require("../models/AbsencePermission");
const { Employee } = require("../models/Employee");
const { State } = require("../models/State");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default permission state is missing from the server!");

  const absencePermission = new AbsencePermission({
    employee,
    date: req.body.date,
    state,
    amount: req.body.amount,
    notes: req.body.notes
  });

  await absencePermission.save();

  res.status(201).send(absencePermission);
});

router.get("/", async (req, res) => {
  const absencePermissions = await AbsencePermission.find(req.query);
  res.status(200).send(absencePermissions);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const absencePermission = await AbsencePermission.findById(req.params.id);
  if (!absencePermission)
    return res.status(404).send("There is no permission with the given ID");
  res.status(200).send(absencePermission);
});

router.put("/:id", async (req, res) => {
  let absencePermission = await AbsencePermission.findById(req.params.id);
  if (!absencePermission)
    return res.status(404).send("There is no permission with the given ID");

  if (absencePermission.state.name != "New")
    return res.status(400).send("You can only modify new permissions");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  absencePermission = {
    employee,
    date: req.body.date,
    state: absencePermission.state,
    amount: req.body.amount,
    notes: req.body.notes
  };

  absencePermission = await AbsencePermission.findByIdAndUpdate(
    req.params.id,
    absencePermission,
    { new: true }
  );

  res.status(200).send(absencePermission);
});

router.delete("/:id", async (req, res) => {
  const absencePermission = await AbsencePermission.findById(req.params.id);
  if (!absencePermission)
    return res
      .status(404)
      .send("There is no absence permission with the given ID");

  if (absencePermission.state.name == "Closed")
    return res.status(400).send("You can't delete closed permission");

  await AbsencePermission.findByIdAndDelete(req.params.id);

  res.status(200).send(absencePermission);
});

//states
router.post("/approve/:id", async (req, res) => {
  let absencePermission = await AbsencePermission.findById(req.params.id);
  if (absencePermission.state != "New")
    return res.status(400).send("You can only approve new permissions");

  const state = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved permission state is missing from the server!");

  absencePermission = await AbsencePermission.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(absencePermission);
});

router.post("/revert/:id", async (req, res) => {
  let absencePermission = await AbsencePermission.findById(req.params.id);
  if (absencePermission.state != "Approved")
    return res.status(400).send("You can only revert approved permissions");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The new permission state is missing from the server!");

  absencePermission = await AbsencePermission.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(absencePermission);
});

router.post("/cancel/:id", async (req, res) => {
  let absencePermission = await AbsencePermission.findById(req.params.id);
  if (absencePermission.state == "Closed")
    return res.status(400).send("You can't cancel closed permissions");

  const state = await State.findOne({ name: "Cancelled" });
  if (!state)
    return res
      .status(500)
      .send("The cancelled deduction state is missing from the server!");

  absencePermission = await AbsencePermission.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(absencePermission);
});

module.exports = router;
