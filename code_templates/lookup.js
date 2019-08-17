const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  }
});

const X = mongoose.model("X", schema);

exports.X = X;
exports.schema = schema;
