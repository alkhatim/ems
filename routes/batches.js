const express = require("express");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const config = require("config");
const moment = require("moment");
const _ = require("lodash");
const admin = require("../middleware/admin");
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
    for (const id of req.body.employees) {
      if (!ObjectId.isValid(id))
        return res.status(404).send("One of the given Ids is not valdid");
      const employee = await Employee.findById(id).select(
        "name salaryInfo socialInsuranceInfo"
      );
      if (employee) employees.push(employee);
    }
  }
  //#endregion

  //#region employees by department
  if (req.body.departmentId) {
    const departmentEmployees = await Employee.find({
      "jobInfo.department._id": req.body.departmentId
    }).select("name salaryInfo socialInsuranceInfo");
    departmentEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }
  //#endregion

  //#region employees by location
  if (req.body.locationId) {
    const locationEmployees = await Employee.find({
      "jobInfo.location._id": req.body.locationId
    }).select("name salaryInfo socialInsuranceInfo");
    locationEmployees.forEach(employee => {
      if (!employees.includes(employee)) employees.push(employee);
    });
  }
  //#endregion

  //TODO: add all employees if none is present
  if (employees.length == 0)
    return res.status(400).send("There is no employees in this batch");

  if (type.name == "Salaries") {
    //TODO: use calculateSalary service
    for (const employee of employees) {
      const batchEmployee = {};
      batchEmployee._id = employee._id;
      batchEmployee.name = employee.name;
      batchEmployee.details = {};

      //#region salary
      let salaryRatio =
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

      batchEmployee.details.vat =
        employee.salaryInfo.totalSalary * config.get("vat");

      const registered = employee.socialInsuranceInfo.registered;
      const socialInsuranceSalary =
        employee.socialInsuranceInfo.socialInsuranceSalary ||
        employee.salaryInfo.totalSalary;

      batchEmployee.details.socialInsurance = registered
        ? socialInsuranceSalary * config.get("employeeSocialInsurance")
        : null;
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
        "type.name": { $ne: "Warning" },
        "state.name": "Approved"
      });
      if (deductions) {
        batchEmployee.details.deductions = 0;
        for (const deduction of deductions) {
          const permissions = await AbsencePermission.find({
            "employee._id": employee._id,
            "type._id": deduction.type._id,
            "state.name": "Approved"
          });
          const currentPermission = permissions.filter(
            p =>
              moment(deduction.date).isBetween(
                moment(p.date),
                moment(p.date).add(p.amount, "days"),
                null,
                "[]"
              ) && deduction.amount <= p.amount
          );
          if (!currentPermission.length)
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
        batchEmployee.details.totalSalary -
        batchEmployee.details.socialInsurance -
        batchEmployee.details.vat +
        (batchEmployee.details.overtimes || 0) -
        (batchEmployee.details.deductions || 0) -
        (batchEmployee.details.loans || 0);

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  }

  if (type.name == "Vacations") {
    for (const employee of employees) {
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
        for (const vacation of vacations) {
          batchEmployee.details.vacations +=
            (vacation.duration * employee.salaryInfo.totalSalary) / 30;
          req.body.entries.vacations.push(vacation._id);
        }
      }
      batchEmployee.details.total = batchEmployee.details.vacations;

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  }

  if (type.name == "Missions") {
    for (const employee of employees) {
      const batchEmployee = {};
      batchEmployee._id = employee._id;
      batchEmployee.name = employee.name;
      batchEmployee.details = {};

      const missions = await Mission.find({
        "employees._id": employee._id,
        "state.name": "Finished"
      });
      if (missions) {
        batchEmployee.details.missions = 0;
        for (const mission of missions) {
          const missionEmployee = _.find(mission.employees, {
            _id: employee._id
          });
          batchEmployee.details.missions +=
            missionEmployee.allowance *
            moment(mission.actualEndDate).diff(moment(mission.startDate), "d");
          req.body.entries.missions.push(mission._id);
        }
      }
      batchEmployee.details.total = batchEmployee.details.missions;

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  }

  if (type.name == "Social Insurance") {
    return res
      .status(400)
      .send("The social insurance batch is automatically generated");
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

  if (batch.total == 0)
    return res
      .status(400)
      .send("The batch contains no amount and thus can't be generated");

  await batch.save();

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

  for (const overtime of req.body.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: closedState });
  }

  for (const deduction of req.body.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: closedState });
  }

  for (const installment of req.body.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentClosedState;
    if (loan.installments.filter(i => i.state.name == "Pending").length == 0)
      loan.state = await State.findOne({ name: "Closed" });
    await loan.save();
  }

  for (const vacation of req.body.entries.vacations) {
    await Vacation.findByIdAndUpdate(vacation._id, {
      state: vacationClosedState
    });
  }

  for (const mission of req.body.entries.missions) {
    await Mission.findByIdAndUpdate(mission._id, { state: missionClosedState });
  }
  //#endregion

  return res.status(201).send(batch);
});

router.put("/:id", async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (!batch)
    return res.status(404).send("There is no batch with the given ID");

  if (batch.state.name !== "New")
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
    for (const id of req.body.employees) {
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

  //#region revert previous entries
  const approvedState = await State.findOne({ name: "Approved" });
  if (!approvedState)
    return res
      .status(500)
      .send("The approved state is missing from the server!");

  const vacationApprovedState = await VacationState.findOne({
    name: "Approved"
  });
  if (!vacationApprovedState)
    return res
      .status(500)
      .send("The approved vacations state is missing from the server!");

  const missionFinishedState = await MissionState.findOne({ name: "Finished" });
  if (!missionFinishedState)
    return res
      .status(500)
      .send("The finished mission state is missing from the server!");

  const installmentPendingState = await InstallmentState.findOne({
    name: "Pending"
  });
  if (!installmentPendingState)
    return res
      .status(500)
      .send("The pending loans installment state is missing from the server!");

  for (const overtime of batch.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: approvedState });
  }

  for (const deduction of batch.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: approvedState });
  }

  for (const vacation of batch.entries.vacations) {
    await Vacation.findByIdAndUpdate(vacation._id, {
      state: vacationApprovedState
    });
  }

  for (const installment of batch.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentPendingState;
    if (loan.state.name == "Closed")
      loan.state = await State.findOne({ name: "Approved" });
    await loan.save();
  }

  for (const mission of batch.entries.missions) {
    await Mission.findByIdAndUpdate(mission._id, {
      state: missionFinishedState
    });
  }
  //#endregion

  //#region caclulations
  if (type.name == "Salaries") {
    for (const employee of employees) {
      const batchEmployee = {};
      batchEmployee._id = employee._id;
      batchEmployee.name = employee.name;
      batchEmployee.details = {};

      //#region salary
      let salaryRatio =
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
        for (const deduction of deductions) {
          const permissions = await AbsencePermission.find({
            "employee._id": employee._id,
            "type._id": deduction.type._id,
            "state.name": "Approved"
          });
          const currentPermission = permissions.filter(
            p =>
              moment(deduction.date).isBetween(
                moment(p.date),
                moment(p.date).add(p.amount, "days"),
                null,
                "[]"
              ) && deduction.amount <= p.amount
          );
          if (!currentPermission.length)
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
  }

  if (type.name == "Vacations") {
    for (const employee of employees) {
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
        for (const vacation of vacations) {
          batchEmployee.details.vacations +=
            (vacation.duration * employee.salaryInfo.totalSalary) / 30;
          req.body.entries.vacations.push(vacation._id);
        }
      }
      batchEmployee.details.total = batchEmployee.details.vacations;

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  }

  if (type.name == "Missions") {
    for (const employee of employees) {
      const batchEmployee = {};
      batchEmployee._id = employee._id;
      batchEmployee.name = employee.name;
      batchEmployee.details = {};

      const missions = await Mission.find({
        "employees._id": employee._id,
        "state.name": "Finished"
      });
      if (missions) {
        batchEmployee.details.missions = 0;
        for (const mission of missions) {
          const missionEmployee = _.find(mission.employees, {
            _id: employee._id
          });
          batchEmployee.details.missions +=
            missionEmployee.allowance *
            moment(mission.actualEndDate).diff(moment(mission.startDate), "d");
          req.body.entries.missions.push(mission._id);
        }
      }
      batchEmployee.details.total = batchEmployee.details.missions;

      if (batchEmployee.details.total > 0) {
        batchEmployees.push(batchEmployee);
        req.body.total += batchEmployee.details.total;
      }
    }
  }

  if (type.name == "Social Insurance") {
    return res
      .status(400)
      .send("The social insurance batch is automatically generated");
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

  if (batch.total == 0) {
    await Batch.findByIdAndDelete(batch._id);
    return res
      .status(400)
      .send("The batch contains no paid amount and thus deleted");
  }

  batch = await Batch.findByIdAndUpdate(req.params.id, batch, { new: true });

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

  for (const overtime of req.body.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: closedState });
  }

  for (const deduction of req.body.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: closedState });
  }

  for (const installment of req.body.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentClosedState;
    if (loan.installments.filter(i => i.state.name == "Pending").length == 0)
      loan.state = await State.findOne({ name: "Closed" });
    await loan.save();
  }

  for (const vacation of req.body.entries.vacations) {
    await Vacation.findByIdAndUpdate(vacation._id, {
      state: vacationClosedState
    });
  }

  for (const mission of req.body.entries.missions) {
    await Mission.findByIdAndUpdate(mission._id, { state: missionClosedState });
  }
  //#endregion

  return res.status(200).send(batch);
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

router.delete("/:id", admin, validateObjectId, async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch)
    return res.status(404).send("There is no batch with the given ID");

  if (batch.state.name !== "New")
    return res
      .status(400)
      .send("You can't delete a closed or an approved batch");

  //#region revert entries
  const approvedState = await State.findOne({ name: "Approved" });
  if (!approvedState)
    return res
      .status(500)
      .send("The approved state is missing from the server!");

  const vacationApprovedState = await VacationState.findOne({
    name: "Approved"
  });
  if (!vacationApprovedState)
    return res
      .status(500)
      .send("The approved vacations state is missing from the server!");

  const missionFinishedState = await MissionState.findOne({ name: "Finished" });
  if (!missionFinishedState)
    return res
      .status(500)
      .send("The finished mission state is missing from the server!");

  const installmentPendingState = await InstallmentState.findOne({
    name: "Pending"
  });
  if (!installmentPendingState)
    return res
      .status(500)
      .send("The pending loans installment state is missing from the server!");

  for (const overtime of batch.entries.overtimes) {
    await Overtime.findByIdAndUpdate(overtime._id, { state: approvedState });
  }

  for (const deduction of batch.entries.deductions) {
    await Deduction.findByIdAndUpdate(deduction._id, { state: approvedState });
  }

  for (const vacation of batch.entries.vacations) {
    await Vacation.findByIdAndUpdate(vacation._id, {
      state: vacationApprovedState
    });
  }

  for (const installment of batch.entries.installments) {
    const loan = await Loan.findOne({ "installments._id": installment._id });
    loan.installments.id(installment._id).state = installmentPendingState;
    if (loan.state.name == "Closed")
      loan.state = await State.findOne({ name: "Approved" });
    await loan.save();
  }

  for (const mission of batch.entries.missions) {
    await Mission.findByIdAndUpdate(mission._id, {
      state: missionFinishedState
    });
  }
  //#endregion

  await Batch.findByIdAndDelete(req.params.id);

  res.status(200).send(batch);
});

//states
router.post("/approve/:id", admin, async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (batch.state.name !== "New")
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

router.post("/revert/:id", admin, async (req, res) => {
  let batch = await Batch.findById(req.params.id);
  if (batch.state.name !== "Approved")
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

router.post("/cancel/:id", admin, async (req, res) => {
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
