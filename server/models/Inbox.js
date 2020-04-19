const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      username: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  messages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true }
  ]
});

const Inbox = mongoose.model("Inbox", schema);

exports.Inbox = Inbox;
