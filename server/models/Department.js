const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const Department = mongoose.model("Department", schema);

exports.Department = Department;
exports.schema = schema;
