const { Contract } = require("../models/Contract");
const { Job } = require("../models/Job");
const { Nationality } = require("../models/Nationality");
const { Department } = require("../models/Department");
const { Gender } = require("../models/Gender");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { User } = require("../models/User");
const { Employee } = require("../models/Employee");

async function seed() {
  await new Contract({ name: "Normal" }).save();
  await new Job({ name: "Developer" }).save();
  await new Nationality({ name: "Sudanese" }).save();
  await new Department({ name: "IT" }).save();
  await new Gender({ name: "Male" }).save();
  await new EmployeeStatus({ name: "Normal" }).save();
  await new User({
    username: "alkhatim",
    password: "12345",
    roles: ["admin"]
  }).save();

  await new Employee({
    name: "mohammed alkhatim",
    gender: await Gender.findOne(),
    nationality: await Nationality.findOne(),
    birthday: new Date(1996, 3, 26),
    address: "alkhartoum",
    phone: 0920012880,
    email: "mohammedalkhateem@gmail.com",
    contract: await Contract.findOne(),
    status: await EmployeeStatus.findOne(),
    jobInfo: {
      job: await Job.findOne(),
      department: await Department.findOne(),
      contractExpiryDate: new Date(2020, 1, 1)
    },
    salaryInfo: {
      basicSalary: 400,
      housingAllowance: 50
    }
  }).save();

  console.log("all done...");
}

module.exports = seed;
