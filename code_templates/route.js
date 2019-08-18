const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { X, validate } = require("../models/X");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!X.findOne({ X: req.body.X })) return res.status(400).send("X");

  const x = new X({
    x: req.body.x
  });

  try {
    await x.save();
  } catch (e) {
    console.log(e);
  }

  return res.status(201).send(_.pick(x));
});

module.exports = router;
