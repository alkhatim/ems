const { Job } = require("../models/Job");

const seed = async function() {
  const job = new Job({
    name: "Manager"
  });

  await job.save();
};

module.exports = seed;
