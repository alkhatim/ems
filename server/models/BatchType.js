const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const BatchType = mongoose.model("BatchType", schema);

exports.BatchType = BatchType;
exports.schema = schema;
