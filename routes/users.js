const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User");
const validateObjectId = require("../middleware/validateObjectId");

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
    .header("access-control-expose-headers", "x-jwt")
    .header("x-jwt", token)
    .send(_.pick(user, ["_id", "username"]));
});

router.put("/:id", admin, validateObjectId, async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("There is no user with the given ID");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (
    await User.findOne({
      username: req.body.username,
      _id: { $ne: req.params.id }
    })
  )
    return res.status(400).send("Username alreay registered");

  req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      password: req.body.password,
      roles: req.body.roles
    },
    { new: true }
  );

  const token = user.genJwt();

  res
    .status(200)
    .header("access-control-expose-headers", "x-jwt")
    .header("x-jwt", token)
    .send(_.pick(user, ["_id", "username"]));
});

router.delete("/:id", [admin, validateObjectId], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("There is no user with the given ID");
  res.status(200).send(_.pick(user, ["_id", "username"]));
});

module.exports = router;
