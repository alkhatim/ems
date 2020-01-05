const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

router.post("/", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(400).send("The username or password or both are wrong");

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match)
    return res.status(400).send("The username or password or both are wrong");

  const token = user.genJwt();

  res
    .status(200)
    .header("access-control-expose-headers", "x-jwt")
    .header("x-jwt", token)
    .send(_.pick(user, ["_id", "username"]));
});

module.exports = router;
