const mongoose = require("mongoose");
const { Contract } = require("../models/Contract");
const { Job } = require("../models/Job");
const { Nationality } = require("../models/Nationality");
const { Department } = require("../models/Department");
const { Gender } = require("../models/Gender");
const { EmployeeStatus } = require("../models/EmployeeStatus");
const { User } = require("../models/User");
const { Employee } = require("../models/Employee");

async function seed() {
  for (key in mongoose.connection.collections) {
    mongoose.connection.dropCollection(key);
  }

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
    phone: "0920012880",
    email: "mohammedalkhateem@gmail.com",
    status: await EmployeeStatus.findOne(),
    jobInfo: {
      contract: await Contract.findOne(),
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

module.exports.employeeJSON = {
  name: "mohammed alkhatim",
  genderId: "5d5e6b21cf308e1e10668be2",
  nationalityId: "5d5e6b20cf308e1e10668be0",
  birthday: "1996-03-26",
  address: "Khartoum-Arkaweet",
  phone: "0920012880",
  bankAccount: "1796861",
  contractId: "5d5e6b1bcf308e1e10668bde",
  statusId: "5d5e6b21cf308e1e10668be3",
  jobId: "5d5e6b20cf308e1e10668bdf",
  departmentId: "5d5e6b21cf308e1e10668be1",
  contractExpiryDate: "2020-01-01",
  basicSalary: 1000,
  foodAllowance: 200
};
