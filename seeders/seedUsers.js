const { User, validate } = require("../models/user");

const seed = async function() {
  const user = new User({
    username: "alkhatim",
    password: "mohammed66mk",
    roles: [admin]
  });

  await user.save();
};

module.exports = seed;
