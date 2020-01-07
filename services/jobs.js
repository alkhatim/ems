const moment = require("moment");
const { Employee } = require("../models/Employee");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { Vacation } = require("../models/Vacation");
const { VacationState } = require("../models/VacationState");
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

  for (vacation of ongoingVacations) {
    await Vacation.findByIdAndUpdate(vacation._id, { state: ongoingState });
    await Employee.findByIdAndUpdate(vacation.employee._id, {
      status: employeeVacationStatus
    });
  }

  for (vacation of finishedVacations) {
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

  for (mission of ongoingMissions) {
    await Mission.findByIdAndUpdate(mission._id, { state: ongoingState });
    await Employee.findByIdAndUpdate(mission.employee._id, {
      status: employeeMissionStatus
    });
  }
};
