const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { X, validate } = require("../models/X");
const { Y } = require("../models/Y");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.y = Y.findById(req.body.yId);
  if (!req.body.y)
    return res.status(400).send("There is no y with the given ID");

  const x = new X({});

  await x.save();

  return res.status(201).send(x);
});

module.exports = router;
