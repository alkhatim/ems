const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const Batch = mongoose.model("Batch", schema);

exports.Batch = Batch;
exports.schema = schema;
