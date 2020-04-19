const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User");
const { Inbox } = require("../models/Inbox");
const validateObjectId = require("../middleware/validateObjectId");

//avatar
router.get("/avatar/:id", validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select("avatar");
  if (!user) return res.status(404).send("There is no user with the given ID");

  res.status(200).send(user.avatar);
});

router.patch("/avatar/:id", validateObjectId, async (req, res) => {
  let user = await User.findById(req.params.id).select("_id username");
  if (!user) return res.status(404).send("There is no user with the given ID");

  if (req.user.id != user.id)
    return res.status(403).send("You can only change your avatar");

  if (!req.body.avatar)
    return res.status(400).send("Please provide a valid avatar");

  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      avatar: req.body.avatar
    },
    { new: true }
  );

  res.status(200).send(_.pick(user, ["_id", "username", "avatar", "role"]));
});

router.post("/", admin, async (req, res) => {
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
    avatar: req.body.avatar,
    role: req.body.role
  });

  await user.save();

  const inbox = new Inbox({
    user: {
      _id: user._id,
      username: user.username
    },
    messages: []
  });

  await inbox.save();

  res.status(201).send(_.pick(user, ["_id", "username", "avatar", "role"]));
});

router.put("/:id", validateObjectId, async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("There is no user with the given ID");

  if (req.user.id != user.id && req.user.role != "admin")
    return res.status(403).send("You must be an admin to edit another user");

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
      avatar: req.body.avatar,
      role: req.body.role
    },
    { new: true }
  );

  const inbox = await Inbox.findOne({ "user._id": user._id });
  inbox.user.username = user.username;

  await inbox.save();

  res.status(200).send(_.pick(user, ["_id", "username", "avatar", "role"]));
});

router.delete("/:id", [admin, validateObjectId], async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("There is no user with the given ID");
  await Inbox.findOneAndDelete({ "user._id": user._id });
  res.status(200).send(_.pick(user, ["_id", "username", "role"]));
});

module.exports = router;
