const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Message, validate } = require("../models/Message");
const { User } = require("../models/User");
const { Inbox } = require("../models/Inbox");
const validateObjectId = require("../middleware/validateObjectId");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const from = _.pick(req.user, ["_id", "username"]);
  if (!from) return res.status(500).send();

  const to = [];
  for (user of req.body.to) {
    to.push(await User.findById(user).select("_id username"));
  }

  const message = new Message({
    from,
    to,
    date: req.body.date,
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

  res.status(201).send(message);
});

router.get("/", async (req, res) => {
  const messages = await Message.find(req.query);
  res.status(200).send(messages);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const message = await Message.findById({ _id: req.params.id });
  if (!message)
    return res.status(404).send("There is no message with the given ID");
  res.status(200).send(message);
});

module.exports = router;
