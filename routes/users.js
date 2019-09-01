const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
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

  await user.save();

  const token = user.genJwt();
  res
    .status(201)
    .header("x-jwt", token)
    .header("access-control-expose-headers", "x-jwt")
    .send(_.pick(user, ["_id", "username"]));
});

// for changing a user's password
router.patch("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("There is no user with the given ID");

  const schema = {
    password: new PasswordComplexity({
      min: 6,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirmentCount: 3
    })
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  await User.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).send();
});

module.exports = router;
