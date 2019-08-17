const { X } = require("../models/x");

const seed = async function() {
  const x = new X({
    name: ""
  });

  await x.save();
};

module.exports = seed;
