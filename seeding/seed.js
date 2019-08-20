const { Contract } = require("../models/Contract");
const { Job } = require("../models/Job");
const { Nationality } = require("../models/Nationality");
const { User } = require("../models/User");
const { Employee } = require("../models/Employee");

async function seed() {
  await new Contract({ name: "Normal" }).save();
  await new Job({ name: "Developer" }).save();
  await new Nationality({ name: "Sudanese" }).save();
  await new User({
    username: "alkhatim",
    password: "12345",
    roles: ["admin"]
  }).save();
}

module.exports = seed;
