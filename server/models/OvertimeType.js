const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const OvertimeType = mongoose.model("OvertimeType", schema);

exports.OvertimeType = OvertimeType;
exports.schema = schema;
