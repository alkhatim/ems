const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");

router.post("/", async (req, res) => {
  const error = validate(req.body);
  if (error) return res.send(400, error.details[0].message);

  if (User.findOne({ username: req.body.username }))
    return res.send(400, "Username alreay registered");

  const user = new User({
    username: req.body.username,
    password: req.body.password,
    roles: []
  });

  await user.save();

  res.send(201, user);
});
