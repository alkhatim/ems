const _ = require("lodash");
const { Employee } = require("../models/Employee");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { Vacation } = require("../models/Vacation");
const { VacationState } = require("../models/VacationState");
const { VacationCredit } = require("../models/VacationCredit");
const { Mission } = require("../models/Mission");
const { MissionState } = require("../models/MissionState");

const vacationStates = async function() {
  const ongoingVacations = await Vacation.find({
    "state.name": "Approved",
    startDate: { $lte: new Date() }
  }).select("_id employee");

  const finishedVacations = await Vacation.find({
    "state.name": "Ongoing",
    endDate: { $lte: new Date() }
  }).select("_id employee");

  const ongoingState = await VacationState.findOne({ name: "Ongoing" });
  const finishedState = await VacationState.findOne({ name: "Finished" });
  const employeeVacationStatus = await EmployeeStatus.findOne({
    name: "Vacation"
  });
  const employeeNormalStatus = await EmployeeStatus.findOne({ name: "Normal" });

  for (const vacation of ongoingVacations) {
    await Vacation.findByIdAndUpdate(vacation._id, { state: ongoingState });
    await Employee.findByIdAndUpdate(vacation.employee._id, {
      status: employeeVacationStatus
    });
  }

  for (const vacation of finishedVacations) {
    await Vacation.findByIdAndUpdate(vacation._id, { state: finishedState });
    await Employee.findByIdAndUpdate(vacation.employee._id, {
      status: employeeNormalStatus
    });
  }
};

const missionStates = async function() {
  const ongoingMissions = await Mission.find({
    "state.name": "Approved",
    startDate: { $lte: new Date() }
  }).select("_id employee");

  const ongoingState = await MissionState.findOne({ name: "Ongoing" });
  const employeeMissionStatus = await EmployeeStatus.findOne({
    name: "Mission"
  });

  for (const mission of ongoingMissions) {
    await Mission.findByIdAndUpdate(mission._id, { state: ongoingState });
    for (const employee of mission.employees) {
      await Employee.findByIdAndUpdate(employee._id, {
        status: employeeMissionStatus
      });
    }
  }
};

const vacationBalances = async function() {
  if (new Date().getDate() == 1 && new Date().getMonth() == 1) {
    const employees = await Employee.find().select("_id name vacationInfo");
    for (const employee of employees) {
      const credit = await VacationCredit.findOne({
        "employee._id": employee._id
      });
      if (credit) {
        credit.totalCredit += employee.vacationInfo.vacationDays;
        await credit.save();
      } else if (employee.vacationInfo.vacationDays) {
        const vacationCredit = new VacationCredit({
          employee: _.pick(employee, ["_id", "name"]),
          totalCredit: employee.vacationInfo.vacationDays,
          remainingCredit: employee.vacationInfo.vacationDays,
          consumedCredit: 0,
          soldCredit: 0
        });
        await vacationCredit.save();
      }
    }
  }
};

module.exports = async function() {
  await vacationStates();
  await missionStates();
  await vacationBalances();
};
