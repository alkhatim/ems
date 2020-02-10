const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Message, validate } = require("../models/Message");
const { User } = require("../models/User");
const { Inbox } = require("../models/Inbox");
const validateObjectId = require("../middleware/validateObjectId");

// inbox
router.get("/inbox", async (req, res) => {
  const inbox = await Inbox.findOne({ "user._id": req.user._id }).populate(
    "messages"
  );
  if (!inbox)
    return res.status(500).send("Somthing is wrong with your account");

  inbox.messages = inbox.messages.reverse();

  res.status(200).send(inbox);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const from = await User.findById(req.user._id).select("_id username avatar");
  if (!from) return res.status(500).send("Somthing is wrong with your account");

  const to = [];
  for (user of req.body.to) {
    to.push(await User.findById(user).select("_id username avatar"));
  }

  const message = new Message({
    from,
    to,
    date: new Date(),
    subject: req.body.subject,
    body: req.body.body,
    url: req.body.url,
    attachments: req.body.attachments,
    deadline: req.body.deadline
  });

  await message.save();

  for (user of message.to) {
    const inbox = await Inbox.findOne({ "user._id": user._id });
    inbox.messages.push(message._id);
    await inbox.save();
  }

  res.status(200).send(message);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const message = await Message.findById({ _id: req.params.id });
  if (!message)
    return res.status(404).send("There is no message with the given ID");
  res.status(200).send(message);
});

//read
router.post("/:id", validateObjectId, async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!message)
    return res.status(404).send("There is no message with the given ID");

  res.status(200).send(message);
});

module.exports = router;
