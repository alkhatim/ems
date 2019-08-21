const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    unique: true
  }
});

const EndOfServiceReason = mongoose.model("EndOfServiceReason", schema);

exports.EndOfServiceReason = EndOfServiceReason;
exports.schema = schema;