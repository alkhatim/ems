const express = require("express");
const router = express.Router();
const moment = require("moment");
const _ = require("lodash");
const { Loan, validate } = require("../models/Loan");
const { Employee } = require("../models/Employee");
const { InstallmentState } = require("../models/InstallmentState");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const currentLoan = await Loan.findOne({
    "employee._id": req.body.employeeId,
    "installments.state.name": "Pending"
  });
  if (currentLoan)
    return res
      .status(400)
      .send("This employee didn't finish paying out his last loan");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const state = await InstallmentState.findOne({ name: "Pending" });

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

router.get("/", async (req, res) => {
  const loans = await Loan.find(req.query);
  res.status(200).send(loans);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const loan = await Loan.find(req.params.id);
  if (!loan) return res.status(404).send("There is no loan with the given ID");

  res.status(200).send(loan);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let loan = await Loan.findById(req.params.id);

  if (loan.installments.filter(i => i.state.name != "Pending") == true)
    return res
      .status(400)
      .send("You can only delete loans with no paid installments!");

  const state = await InstallmentState.findOne({ name: "Pending" });

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

  loan = {
    employee: loan.employee,
    date: req.body.date,
    firstPayDate: moment(req.body.firstPayDate)
      .endOf("month")
      .toDate(),
    amount: req.body.amount,
    installments: req.body.installments
  };

  await loan.save();

  res.status(200).send(loan);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const loan = await Loan.findById(req.params.id);

  if (loan.installments.filter(i => i.state.name != "Pending") == true)
    return res
      .status(400)
      .send("You can only delete loans with no paid installments!");

  await Loan.findByIdAndDelete(req.params.id);
  res.status(200).send(loan);
});

router.get("/installments/:id", validateObjectId, async (req, res) => {
  const loan = await Loan.findOne({ "installments._id": req.params.id });
  if (!loan)
    return res.status(404).send("There is no installment with the given ID");

  const installment = loan.installments.find(i => i._id == req.params.id);
  res.status(200).send(installment);
});

router.patch("/installments/:id", validateObjectId, async (req, res) => {
  const loan = await Loan.findOne({ "installments._id": req.params.id });
  if (!loan)
    return res.status(404).send("There is no installment with the given ID");

  const installment = loan.installments.find(i => i._id == req.params.id);
  const index = loan.installments.findIndex(i => i._id == req.params.id);

  const state = await InstallmentState.findById(req.body.statusId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  installment.state = state;

  loan.installments[index] = installment;
  await loan.save();
});

module.exports = router;
