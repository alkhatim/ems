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
  await new Nationality({ name: "Sudanese" }).save();
  await new User({
    username: "alkhatim",
    password: "12345",
    roles: ["admin"]
  }).save();

  console.log("all done...");
}

module.exports = seed;
