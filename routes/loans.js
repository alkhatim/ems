const express = require("express");
const router = express.Router();
const moment = require("moment");
const _ = require("lodash");
const { Loan, validate } = require("../models/Loan");
const { Employee } = require("../models/Employee");
const { InstallmentState } = require("../models/InstallmentState");
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
        date: moment(req.body.firstPayDate)
          .endOf("month")
          .toDate(),
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
        date: moment(req.body.firstPayDate)
          .add(i, "month")
          .endOf("month")
          .toDate(),
        amount: req.body.installmentAmount,
        state
      };
    });
    if (lastInstallmentAmount)
      req.body.installments.push({
        date: moment(_.last(req.body.installments).month)
          .add(1, "month")
          .endOf("month")
          .toDate(),
        amount: lastInstallmentAmount,
        state
      });
  }

  const loan = new Loan({
    employee,
    date: req.body.date,
    firstPayDate: moment(req.body.firstPayDate)
      .endOf("month")
      .toDate(),
    amount: req.body.amount,
    installments: req.body.installments
  });

  await loan.save();

  res.status(201).send(loan);
});

router.get("/", async (req, res) => {});

module.exports = router;
