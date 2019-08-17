const { Contract } = require("../models/Contract");

const seed = async function() {
  const contract = new Contract({
    name: "Normal"
  });

  await contract.save();
};

module.exports = seed;
