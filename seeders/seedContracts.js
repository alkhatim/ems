const { Contract } = require("../models/Contract");

const seed = async function() {
  const contract = new X({
    name: "Normal"
  });

  await contract.save();
};

module.exports = seed;
