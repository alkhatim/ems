const express = require("express");
const router = express.Router();
const { Loan, validate } = require("../models/Loan");
const { Employee } = require("../models/Employee");
const { InstallmentState } = require("../models/InstallmentState");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const state = await InstallmentState.findOne({ name: "Scheduled" });

  if (req.body.installmentAmount == req.body.amount)
    req.body.installments = [
      {
        month: req.body.startingMonth,
        amount: req.body.amount,
        state
      }
    ];
  else {
    const lastInstallmentAmount = req.body.amount % req.body.installmentAmount;
    const numberOfInstallments = Math.floor(
      req.body.amount / req.body.installmentAmount
    );
    req.body.installments = _.range(numberOfInstallments);
    req.body.installments.forEach(i => {
      req.body.installments[i] = {
        month: req.body.startingMonth + i,
        amount: req.body.installmentAmount,
        state
      };
    });
    if (lastInstallmentAmount)
      req.body.installments.push({
        month: req.body.startingMonth,
        amount: lastInstallmentAmount,
        state
      });
  }

  const loan = new Loan({
    employee,
    date: req.body.date,
    startingMonth: req.body.startingMonth,
    amount: req.body.amount,
    installments: req.body.installments
  });

  await loan.save();

  res.status(201).send(loan);
});

module.exports = router;
