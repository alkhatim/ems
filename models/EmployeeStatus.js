const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const EmployeeStatus = mongoose.model("EmployeeStatus", schema);

exports.EmployeeStatus = EmployeeStatus;
exports.schema = schema;
