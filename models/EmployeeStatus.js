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

const EmployeeStatus = mongoose.model("EmployeeStatus", schema);

exports.EmployeeStatus = EmployeeStatus;
exports.schema = schema;
