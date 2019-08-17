const { Nationality, validate } = require("../models/Nationality");

const seed = async function() {
  const nationality = new Nationality({
    name: "Sudanese"
  });

  await nationality.save();
};

module.exports = seed;
