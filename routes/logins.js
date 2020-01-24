const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
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
    .send(_.pick(user, ["_id", "username", "avatar", "role"]));
});

router.get("/", async (req, res) => {
  const token = req.header("x-jwt");
  if (!token) return res.status(401).send("No authentication token provided");

  try {
    const tokenUser = jwt.verify(token, config.get("jwtSecret"));
    const user = await User.findById(tokenUser._id).select(
      "_id username avatar role"
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Invalid authentication token");
  }
});

module.exports = router;
