const express = require("express");
const router = express.Router();
const moment = require("moment");
const _ = require("lodash");
const admin = require("../middleware/admin");
const { Loan, validate } = require("../models/Loan");
const { Employee } = require("../models/Employee");
const { LoanState: State } = require("../models/LoanState");
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

  if (loan.state.name == "Closed" || loan.state.name == "Canceled")
    return res
      .status(400)
      .send("You can't only modify closed or canceled loans");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId).select(
    "_id name"
  );
  if (!employee)
    return res.status(404).send("There is no employee with the given ID");

  const installmentState = await InstallmentState.findOne({ name: "Pending" });

  const closedInstallments = loan.installments.filter(
    i => i.state.name == "Closed"
  );

  if (closedInstallments.length) {
    req.body.installments = closedInstallments;

    const totalPaid = closedInstallments.reduce(
      (total, installment) => total + installment.amount,
      0
    );
    const remaining = req.body.amount - totalPaid;
    const lastDate = closedInstallments[closedInstallments.length - 1].date;

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
    req.body.state = await State.findOne({ name: "Closed" });
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

router.delete("/:id", admin, validateObjectId, async (req, res) => {
  const loan = await Loan.findById(req.params.id).select("installments");

  if (loan.installments.filter(i => i.state.name != "Pending") == true)
    return res
      .status(400)
      .send("You can't delete loans with pending installments!");

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

//states
router.post("/approve/:id", admin, async (req, res) => {
  let loan = await Loan.findById(req.params.id);
  if (loan.state.name != "New")
    return res.status(400).send("You can only approve new loans");

  const state = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved loan state is missing from the server!");

  loan = await Loan.findByIdAndUpdate(req.params.id, { state }, { new: true });
  res.status(200).send(loan);
});

router.post("/revert/:id", admin, async (req, res) => {
  let loan = await Loan.findById(req.params.id);
  if (loan.state.name != "Approved")
    return res.status(400).send("You can only revert approved loans");
  if (loan.installments.find(i => i.state.name == "Closed"))
    return res
      .status(400)
      .send("You can't revert a loan with a paid installment");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The new loan state is missing from the server!");

  loan = await Loan.findByIdAndUpdate(req.params.id, { state }, { new: true });
  res.status(200).send(loan);
});

router.post("/freeze/:id", admin, async (req, res) => {
  let loan = await Loan.findById(req.params.id);
  if (loan.state.name != "Approved")
    return res.status(400).send("You can only freeze approved loans");

  const state = await State.findOne({ name: "Frozen" });
  if (!state)
    return res
      .status(500)
      .send("The frozen loan state is missing from the server!");

  loan = await Loan.findByIdAndUpdate(req.params.id, { state }, { new: true });
  res.status(200).send(loan);
});

router.post("/unfreeze/:id", admin, async (req, res) => {
  let loan = await Loan.findById(req.params.id);
  if (loan.state.name != "Frozen")
    return res.status(400).send("You can only unfreeze frozen loans");

  const state = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved loan state is missing from the server!");

  loan = await Loan.findByIdAndUpdate(req.params.id, { state }, { new: true });
  res.status(200).send(loan);
});

router.post("/cancel/:id", admin, async (req, res) => {
  let loan = await Loan.findById(req.params.id);
  if (loan.state.name == "Closed")
    return res.status(400).send("You can't cancel closed loans");

  const state = await State.findOne({ name: "Canceled" });
  if (!state)
    return res
      .status(500)
      .send("The canceled loan state is missing from the server!");

  loan = await Loan.findByIdAndUpdate(req.params.id, { state }, { new: true });
  res.status(200).send(loan);
});

//installment state
router.post(
  "/installments/pay/:id",
  [admin, validateObjectId],
  async (req, res) => {
    const loan = await Loan.findOne({ "installments._id": req.params.id });
    if (!loan)
      return res.status(404).send("There is no installment with the given ID");
    if (loan.state.name != "Approved")
      return res
        .status(400)
        .send("You can only pay installments for approved loans");

    const installment = loan.installments.find(i => i._id == req.params.id);
    const index = loan.installments.findIndex(i => i._id == req.params.id);

    const state = await InstallmentState.findOne({ name: "Closed" });
    if (!state)
      return res
        .status(500)
        .send("The closed installment state is missing from the server!");

    installment.state = state;

    loan.installments[index] = installment;
    if (loan.installments.filter(i => i.state.name == "Pending").length == 0)
      loan.state = await State.findOne({ name: "Closed" });
    await loan.save();
    res.status(200).send(installment);
  }
);

module.exports = router;
