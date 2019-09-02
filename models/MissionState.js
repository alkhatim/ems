const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const MissionState = mongoose.model("MissionState", schema);

exports.MissionState = MissionState;
exports.schema = schema;
