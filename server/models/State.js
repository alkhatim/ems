const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const State = mongoose.model("State", schema);

exports.State = State;
exports.schema = schema;
