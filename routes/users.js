const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (await User.findOne({ username: req.body.username }))
    return res.status(400).send("Username alreay registered");

  req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  const user = new User({
    username: req.body.username,
    password: req.body.password,
    roles: req.body.roles
  });

  try {
    await user.save();
  } catch (e) {
    console.log(e);
  }
  const token = user.genJwt();
  return res
    .status(201)
    .header("x-jwt", token)
    .header("access-control-expose-headers", "x-jwt")
    .send(_.pick(user, ["_id", "username"]));
});

module.exports = router;
