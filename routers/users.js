const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!User.findOne({ username: req.body.username }))
    return res.status(400).send("Username alreay registered");

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

  return res.status(201).send(user);
});

module.exports = router;
