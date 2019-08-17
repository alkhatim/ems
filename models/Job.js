const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  }
});

const Job = mongoose.model("Job", schema);

exports.Job = Job;
exports.schema = schema;
