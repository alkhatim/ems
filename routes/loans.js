const express = require("express");
const router = express.Router();
const moment = require("moment");
const _ = require("lodash");
const { Loan, validate } = require("../models/Loan");
const { Employee } = require("../models/Employee");
const { State } = require("../models/State");
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

  const installmentState = await InstallmentState.findOne({ name: "Pending" });
  if (!installmentState)
    return res
      .status(500)
      .send("The default installment state is missing from the server");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default loan state is missing from the server");

  if (req.body.installmentAmount == req.body.amount)
    req.body.installments = [
      {
        date: moment(req.body.firstPayDate)
          .endOf("month")
          .toDate(),
        amount: req.body.amount,
        state: installmentState
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
        state: installmentState
      };
    });
    if (lastInstallmentAmount)
      req.body.installments.push({
        date: moment(_.last(req.body.installments).date)
          .add(1, "month")
          .endOf("month")
          .toDate(),
        amount: lastInstallmentAmount,
        state: installmentState
      });
  }

  const loan = new Loan({
    employee,
    date: req.body.date,
    firstPayDate: moment(req.body.firstPayDate)
      .endOf("month")
      .toDate(),
    amount: req.body.amount,
    state,
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
  const loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).send("There is no loan with the given ID");

  res.status(200).send(loan);
});

router.put("/:id", validateObjectId, async (req, res) => {
  let loan = await Loan.findById(req.params.id);
  if (!loan) return res.status(404).send("There is no Loan with the given ID");

  if (loan.state.name == "Resolved" || loan.state.name == "Canceled")
    return res
      .status(400)
      .send("You can't modify a loan that has been resolved or canceled");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const installmentState = await InstallmentState.findOne({ name: "Pending" });

  const paidInstallments = loan.installments.filter(
    i => i.state.name == "Resolved"
  );

  if (paidInstallments.length) {
    req.body.installments = paidInstallments;

    const totalPaid = paidInstallments.reduce(
      (total, installment) => total + installment.amount,
      0
    );
    const remaining = req.body.amount - totalPaid;
    const lastDate = paidInstallments[paidInstallments.length - 1].date;

    if (remaining < 0)
      return res
        .status(400)
        .send(
          "The amount of the loan can't be less than the amount already paid by the employee"
        );

    if (req.body.installmentAmount == remaining) {
      req.body.installments.push({
        date: moment(lastDate)
          .add(1, "month")
          .endOf("month")
          .toDate(),
        amount: remaining,
        state: installmentState
      });
    }

    if (req.body.installmentAmount < remaining) {
      const lastInstallmentAmount = remaining % req.body.installmentAmount;
      const numberOfInstallments = Math.floor(
        remaining / req.body.installmentAmount
      );
      const newInstallments = _.range(numberOfInstallments);
      newInstallments.forEach(i => {
        req.body.installments.push({
          date: moment(lastDate)
            .add(i + 1, "month")
            .endOf("month")
            .toDate(),
          amount: req.body.installmentAmount,
          state: installmentState
        });
      });
      if (lastInstallmentAmount)
        req.body.installments.push({
          date: moment(_.last(req.body.installments).month)
            .add(1, "month")
            .endOf("month")
            .toDate(),
          amount: lastInstallmentAmount,
          state: installmentState
        });
    }

    if (req.body.installmentAmount > remaining && remaining != 0) {
      req.body.installments.push({
        date: moment(lastDate)
          .add(1, "month")
          .endOf("month")
          .toDate(),
        amount: remaining,
        state: installmentState
      });
    }
  } else {
    if (req.body.installmentAmount == req.body.amount)
      req.body.installments = [
        {
          date: moment(req.body.firstPayDate)
            .endOf("month")
            .toDate(),
          amount: req.body.amount,
          state: installmentState
        }
      ];
    else {
      const lastInstallmentAmount =
        req.body.amount % req.body.installmentAmount;
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
          state: installmentState
        };
      });
      if (lastInstallmentAmount)
        req.body.installments.push({
          date: moment(_.last(req.body.installments).month)
            .add(1, "month")
            .endOf("month")
            .toDate(),
          amount: lastInstallmentAmount,
          state: installmentState
        });
    }
  }

  if (
    req.body.installments.filter(i => i.state.name == "Pending").length == 0 &&
    loan.state.name == "Approved"
  )
    req.body.state = await State.findOne({ name: "Resolved" });
  else req.body.state = loan.state;

  loan = {
    employee: loan.employee,
    date: req.body.date,
    firstPayDate: loan.firstPayDate,
    amount: req.body.amount,
    state: req.body.state,
    installments: req.body.installments
  };

  loan = await Loan.findByIdAndUpdate(req.params.id, loan, { new: true });

  res.status(200).send(loan);
});

// for changing a loan's state
router.patch("/:id", validateObjectId, async (req, res) => {
  const state = await State.findById(req.body.stateId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  const loan = await Loan.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  if (!loan) return res.status(404).send("There is no loan with the given ID");

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

  if (loan.state.name != "Approved")
    return res
      .status(400)
      .send("You can mark installments as paid only for approved loans");

  const installment = loan.installments.find(i => i._id == req.params.id);
  const index = loan.installments.findIndex(i => i._id == req.params.id);

  const state = await InstallmentState.findById(req.body.stateId);
  if (!state)
    return res.status(404).send("There is no state with the given ID");

  if (state.name != "Resolved")
    return res.status(400).send("You can't revert a paid installment");

  installment.state = state;

  loan.installments[index] = installment;
  if (loan.installments.filter(i => i.state.name == "Pending").length == 0)
    loan.state = await State.findOne({ name: "Resolved" });
  await loan.save();
  res.status(200).send(installment);
});

module.exports = router;
