const express = require("express");
const router = express.Router();
const moment = require("moment");
const ObjectId = require("mongoose").Types.ObjectId;
const { Batch, validate } = require("../models/Batch");
const { Employee } = require("../models/Employee");
const { BatchType } = require("../models/BatchType");
const { State } = require("../models/State");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Vacation } = require("../models/Vacation");
const { Mission } = require("../models/Mission");
const { AbsencePermission } = require("../models/AbsencePermission");
const { Loan } = require("../models/Loan");
const { InstallmentState } = require("../models/InstallmentState");
const { VacationState } = require("../models/VacationState");
const { MissionState } = require("../models/MissionState");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const type = await BatchType.findById(req.body.typeId);
  if (!type)
    return res.status(404).send("There is no batch type with the given ID");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default batch state is missing from the server!");

  //#region declarations
  const employees = [];
  const batchEmployees = [];
  req.body.entries = {
    overtimes: [],
    deductions: [],
    installments: [],
    vacations: [],
    missions: []
  };
  req.body.total = 0;
  //#endregion

  //#region selected employees
  if (req.body.employees) {
    for (id of req.body.employees) {
      if (!ObjectId.isValid(id))
        return res.status(404).send("One of the given Ids is not valdid");
      const employee = await Employee.findById(id).select("name salaryInfo");
      if (employee) employees.push(employee);
    }
  }
  //#endregion

  //#region employees by department
  if (req.body.departmentId) {
    const departmentEmployees = await Employee.find({
      "jobInfo.department._id": req.body.departmentId
    }).select("name salaryInfo");
    departmentEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }
  //#endregion

  //#region employees by location
  if (req.body.locationId) {
    const locationEmployees = await Employee.find({
      "jobInfo.location._id": req.body.locationId
    }).select("name salaryInfo");
    locationEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }
  //#endregion

  if (employees.length == 0)
    return res.status(400).send("There is no employees in this batch");

  if (type.name == "Salaries") {
    for (employee of employees) {
      const batchEmployee = {};
      batchEmployee._id = employee._id;
      batchEmployee.name = employee.name;
      batchEmployee.details = {};

      //#region salary
      const salaryRatio =
        (30 -
          (30 -
            moment(req.body.date)
              .toDate()
              .getDate())) /
        30;

      if (
        moment(req.body.date)
          .toDate()
          .getDate() == 31
      )
        salaryRatio = 1;

      if (!salaryRatio)
        return res.status(400).send("Enter a correct batch date");

      batchEmployee.details.basicSalary =
        employee.salaryInfo.basicSalary * salaryRatio;

      if (employee.salaryInfo.livingExpenseAllowance)
        batchEmployee.details.livingExpenseAllowance =
          employee.salaryInfo.livingExpenseAllowance * salaryRatio;

      if (employee.salaryInfo.housingAllowance)
        batchEmployee.details.housingAllowance =
          employee.salaryInfo.housingAllowance * salaryRatio;

      if (employee.salaryInfo.transportAllowance)
        batchEmployee.details.transportAllowance =
          employee.salaryInfo.transportAllowance * salaryRatio;

      if (employee.salaryInfo.foodAllowance)
        batchEmployee.details.foodAllowance =
          employee.salaryInfo.foodAllowance * salaryRatio;

      batchEmployee.details.totalSalary =
        employee.salaryInfo.totalSalary * salaryRatio;
      //#endregion

      //#region overtimes
      const overtimes = await Overtime.find({
        "employee._id": employee._id,
        date: { $lte: req.body.date },
        "state.name": "Approved"
      });
      if (overtimes) {
        batchEmployee.details.overtimes = 0;
        overtimes.forEach(overtime => {
          batchEmployee.details.overtimes += overtime.total;
          req.body.entries.overtimes.push(overtime._id);
        });
      }
      //#endregion

      //#region deductions
      const deductions = await Deduction.find({
        "employee._id": employee._id,
        date: { $lte: req.body.date },
        "state.name": "Approved"
      });
      if (deductions) {
        batchEmployee.details.deductions = 0;
        for (deduction of deductions) {
          const permissions = await AbsencePermission.find({
            "employee._id": employee._id
          });
          const currentPermissions = permissions.filter(p =>
            moment(deduction.date).isBetween(
              moment(p.date),
              moment(p.date).add(p.amount, "days"),
              null,
              "[]"
            )
          );
          if (currentPermissions.length)
            batchEmployee.details.deductions += deduction.total;
          req.body.entries.deductions.push(deduction._id);
        }
      }
      //#endregion

      //#region loans
      const loan = await Loan.findOne({
        "employee._id": employee._id,
        "state.name": "Approved"
      });
      if (loan) {
        const installments = loan.installments.filter(
          i =>
            i.state.name == "Pending" &&
            i.date <=
              moment(req.body.date)
                .endOf("month")
                .toDate()
        );
        if (installments) {
          batchEmployee.details.loans = 0;
          installments.forEach(installment => {
            batchEmployee.details.loans += installment.amount;
            req.body.entries.installments.push(installment._id);
          });
        }
      }
      //#endregion

      batchEmployee.details.total =
        batchEmployee.details.totalSalary +
        (batchEmployee.details.overtimes || 0) -
        (batchEmployee.details.deductions || 0) -
        (batchEmployee.details.loans || 0);

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  } else if (type.name == "Vacations") {
    for (employee of employees) {
      const batchEmployee = {};
      batchEmployee._id = employee._id;
      batchEmployee.name = employee.name;
      batchEmployee.details = {};

      const vacations = await Vacation.find({
        "employee._id": employee._id,
        "type.name": "Purchase",
        "state.name": "Approved"
      });
      if (vacations) {
        batchEmployee.details.vacations = 0;
        batchEmployee.totalSalary = await Employee.findById(
          employee._id
        ).select("salaryInfo").salaryInfo.totalSalary;
        for (vacation of vacations) {
          batchEmployee.details.vacations +=
            (vacation.duration * batchEmployee.totalSalary) / 30;
          req.body.entries.vacations.push(vacation._id);
        }
      }
      batchEmployee.details.total = batchEmployee.details.vacations;

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  } else if (type.name == "Missions") {
  } else if (type.name == "Social Insurance") {
    return res
      .status(400)
      .send("The social insurance batch is automatically generated");
  } else if (type.name == "Bonus") {
  }

  const batch = new Batch({
    notes: req.body.notes,
    date: req.body.date,
    type,
    state,
    total: req.body.total,
    employees: batchEmployees,
    entries: req.body.entries
  });

  await batch.save();

  return res.status(201).send(batch);

  //#region close entries
  const closedState = await State.findOne({ name: "Closed" });
  if (!state)
    return res.status(500).send("The closed state is missing from the server!");

  const vacationClosedState = await VacationState.findOne({ name: "Closed" });
  if (!state)
    return res.status(500).send("The closed state is missing from the server!");

  const missionClosedState = await MissionState.findOne({ name: "Closed" });
  if (!state)
    return res.status(500).send("The closed state is missing from the server!");

  const installmentClosedState = await InstallmentState.findOne({
    name: "Closed"
  });
  if (!state)
    return res.status(500).send("The closed state is missing from the server!");

  for (overtime of req.body.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: closedState });
  }

  for (deduction of req.body.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: closedState });
  }

  for (installment of req.body.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentClosedState;
    await loan.save();
  }

  for (vacation of req.body.entries.vacations) {
    await Vacation.findByIdAndUpdate(vacation._id, {
      state: vacationClosedState
    });
  }

  for (mission of req.body.entries.missions) {
    await Mission.findByIdAndUpdate(mission._id, { state: missionClosedState });
  }
  //#endregion
});

router.put("/:id", async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (!batch)
    return res.status(404).send("There is no batch with the given ID");

  if (batch.state.name != "New")
    return res.status(400).send("You can only modify new batches");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const type = await BatchType.findById(req.body.typeId);
  if (!type)
    return res.status(404).send("There is no batch type with the given ID");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The default batch state is missing from the server!");

  //#region declarations
  const employees = [];
  const batchEmployees = [];
  const entries = {
    overtimes: [],
    deductions: [],
    installments: []
  };
  req.body.entries = {
    overtimes: [],
    deductions: [],
    installments: []
  };
  req.body.total = 0;
  //#endregion

  //#region selected employees
  if (req.body.employees) {
    for (id of req.body.employees) {
      if (!ObjectId.isValid(id))
        return res.status(404).send("One of the given Ids is not valdid");
      const employee = await Employee.findById(id).select("name salaryInfo");
      if (employee) employees.push(employee);
    }
  }
  //#endregion

  //#region employees by department
  if (req.body.departmentId) {
    const departmentEmployees = await Employee.find({
      "jobInfo.department._id": req.body.departmentId
    }).select("name salaryInfo");
    departmentEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }
  //#endregion

  //#region employees by location
  if (req.body.locationId) {
    const locationEmployees = await Employee.find({
      "jobInfo.location._id": req.body.locationId
    }).select("name salaryInfo");
    locationEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }
  //#endregion

  if (employees.length == 0)
    return res.status(400).send("There is no employees in this batch");

  //#region calculate salary
  for (employee of employees) {
    const batchEmployee = {};
    batchEmployee._id = employee._id;
    batchEmployee.name = employee.name;
    batchEmployee.details = {};

    //#region salary

    const salaryRatio =
      (30 -
        (30 -
          moment(req.body.date)
            .toDate()
            .getDate())) /
      30;

    if (
      moment(req.body.date)
        .toDate()
        .getDate() == 31
    )
      salaryRatio = 1;

    if (!salaryRatio) return res.status(400).send("Enter a correct batch date");

    batchEmployee.details.basicSalary =
      employee.salaryInfo.basicSalary * salaryRatio;

    if (employee.salaryInfo.livingExpenseAllowance)
      batchEmployee.details.livingExpenseAllowance =
        employee.salaryInfo.livingExpenseAllowance * salaryRatio;

    if (employee.salaryInfo.housingAllowance)
      batchEmployee.details.housingAllowance =
        employee.salaryInfo.housingAllowance * salaryRatio;

    if (employee.salaryInfo.transportAllowance)
      batchEmployee.details.transportAllowance =
        employee.salaryInfo.transportAllowance * salaryRatio;

    if (employee.salaryInfo.foodAllowance)
      batchEmployee.details.foodAllowance =
        employee.salaryInfo.foodAllowance * salaryRatio;

    batchEmployee.details.totalSalary =
      employee.salaryInfo.totalSalary * salaryRatio;
    //#endregion

    //#region overtimes
    const overtimes = await Overtime.find({
      "employee._id": employee._id,
      date: { $lte: req.body.date },
      "state.name": "Approved"
    });
    if (overtimes) {
      batchEmployee.details.overtimes = 0;
      overtimes.forEach(overtime => {
        batchEmployee.details.overtimes += overtime.total;
        entries.overtimes.push(overtime);
      });
    }
    //#endregion

    //#region deductions
    const deductions = await Deduction.find({
      "employee._id": employee._id,
      date: { $lte: req.body.date },
      "state.name": "Approved"
    });
    if (deductions) {
      batchEmployee.details.deductions = 0;
      for (deduction of deductions) {
        const permissions = await AbsencePermission.find({
          "employee._id": employee._id
        });
        const currentPermissions = permissions.filter(p =>
          moment(deduction.date).isBetween(
            moment(p.date),
            moment(p.date).add(p.amount, "days"),
            null,
            "[]"
          )
        );
        if (!currentPermissions.length) {
          batchEmployee.details.deductions += deduction.total;
          entries.deductions.push(deduction);
        }
      }
    }
    //#endregion

    //#region loans
    const loan = await Loan.findOne({
      "employee._id": employee._id,
      "state.name": "Approved"
    });
    if (loan) {
      const installments = loan.installments.filter(
        i =>
          i.state.name == "Pending" &&
          i.date <=
            moment(req.body.date)
              .endOf("month")
              .toDate()
      );
      if (installments) {
        batchEmployee.details.loans = 0;
        installments.forEach(installment => {
          batchEmployee.details.loans += installment.amount;
          entries.installments.push(installment);
        });
      }
    }
    //#endregion

    batchEmployee.details.total =
      batchEmployee.details.totalSalary +
      (batchEmployee.details.overtimes || 0) -
      (batchEmployee.details.deductions || 0) -
      (batchEmployee.details.loans || 0);

    batchEmployees.push(batchEmployee);
    req.body.total += batchEmployee.details.total;
  }
  //#endregion

  //#region add entries
  for (overtime of entries.overtimes) {
    req.body.entries.overtimes.push(overtime._id);
  }

  for (deduction of entries.deductions) {
    req.body.entries.deductions.push(deduction._id);
  }

  for (installment of entries.installments) {
    req.body.entries.installments.push(installment._id);
  }
  //#endregion

  batch = {
    notes: req.body.notes,
    date: req.body.date,
    type,
    state,
    total: req.body.total,
    employees: batchEmployees,
    entries: req.body.entries
  };

  //#region revert previous entries
  const approvedState = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved state is missing from the server!");

  const installmentPendingState = await InstallmentState.findOne({
    name: "Pending"
  });
  if (!state)
    return res
      .status(500)
      .send("The pending loans installment state is missing from the server!");

  for (overtime of batch.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: approvedState });
  }

  for (deduction of batch.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: approvedState });
  }

  for (installment of batch.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentPendingState;
    await loan.save();
  }
  //#endregion

  batch = await Batch.findByIdAndUpdate(req.params.id, batch, { new: true });

  return res.status(200).send(batch);

  //#region close entries
  const closedState = await State.findOne({ name: "Closed" });
  if (!state)
    return res.status(500).send("The closed state is missing from the server!");

  const installmentClosedState = await InstallmentState.findOne({
    name: "Closed"
  });
  if (!state)
    return res
      .status(500)
      .send("The closed loans state is missing from the server!");

  for (overtime of entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: closedState });
  }

  for (deduction of entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: closedState });
  }

  for (installment of entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentClosedState;
    await loan.save();
  }
  //#endregion
});

router.get("/", async (req, res) => {
  const batches = await Batch.find(req.query);
  res.status(200).send(batches);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch)
    return res.status(404).send("There is no batch with the given ID");

  res.status(200).send(batch);
});

router.delete("/:id", validateObjectId, async (req, res) => {
  const batch = await Batch.findById(req.params.id).select("state");
  if (!batch)
    return res.status(404).send("There is no batch with the given ID");

  if (batch.state.name != "New")
    return res
      .status(400)
      .send("You can't delete a closed or an approved batch");

  await Batch.findByIdAndDelete(req.params.id);

  //#region revert entries
  const approvedState = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved state is missing from the server!");

  const installmentPendingState = await InstallmentState.findOne({
    name: "Pending"
  });
  if (!state)
    return res
      .status(500)
      .send("The pending loans installment state is missing from the server!");

  for (overtime of batch.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: approvedState });
  }

  for (deduction of batch.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: approvedState });
  }

  for (installment of batch.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentPendingState;
    await loan.save();
  }
  //#endregion

  res.status(200).send(batch);
});

//states
router.post("/approve/:id", async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (batch.state.name != "New")
    return res.status(400).send("You can only approve new batches");

  const state = await State.findOne({ name: "Approved" });
  if (!state)
    return res
      .status(500)
      .send("The approved batch state is missing from the server!");

  batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );

  res.status(200).send(batch);
});

router.post("/revert/:id", async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (batch.state.name != "Approved")
    return res.status(400).send("You can only revert approved batches");

  const state = await State.findOne({ name: "New" });
  if (!state)
    return res
      .status(500)
      .send("The new batch state is missing from the server!");

  batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(batch);
});

router.post("/cancel/:id", async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (batch.state.name == "Closed")
    return res.status(400).send("You can't cancel closed batches");

  const state = await State.findOne({ name: "Canceled" });
  if (!state)
    return res
      .status(500)
      .send("The canceled batch state is missing from the server!");

  batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { state },
    { new: true }
  );
  res.status(200).send(batch);
});

module.exports = router;
