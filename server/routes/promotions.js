const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middleware/admin");
const { Promotion, validate } = require("../models/Promotion");
const { Employee } = require("../models/Employee");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId);

  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const promotion = new Promotion({
    employee: _.pick(employee, ["_id", "name"]),
    date: new Date(),
    notes: req.body.notes,
    percentage: req.body.percentage
  });

  if (employee.salaryInfo.basicSalary)
    employee.salaryInfo.basicSalary +=
      employee.salaryInfo.basicSalary * req.body.percentage;

  if (employee.salaryInfo.housingAllowance)
    employee.salaryInfo.housingAllowance +=
      employee.salaryInfo.housingAllowance * req.body.percentage;

  if (employee.salaryInfo.livingExpenseAllowance)
    employee.salaryInfo.livingExpenseAllowance +=
      employee.salaryInfo.livingExpenseAllowance * req.body.percentage;

  if (employee.salaryInfo.transportAllowance)
    employee.salaryInfo.transportAllowance +=
      employee.salaryInfo.transportAllowance * req.body.percentage;

  if (employee.salaryInfo.foodAllowance)
    employee.salaryInfo.foodAllowance +=
      employee.salaryInfo.foodAllowance * req.body.percentage;

  employee.salaryInfo.totalSalary +=
    employee.salaryInfo.totalSalary * req.body.percentage;

  await promotion.save();
  await employee.save();

  res.status(201).send(promotion);
});

router.get("/", async (req, res) => {
  const promotions = await Promotion.find(req.query);
  res.status(200).send(promotions);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const promotion = await Promotion.findById({ _id: req.params.id });
  if (!promotion)
    return res.status(404).send("There is no promotion with the given ID");
  res.status(200).send(promotion);
});

module.exports = router;
