const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
    unique: true
  }
});

const OvertimeType = mongoose.model("OvertimeType", schema);

exports.OvertimeType = OvertimeType;
exports.schema = schema;
