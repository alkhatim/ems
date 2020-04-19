const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const InstallmentState = mongoose.model("InstallmentState", schema);

exports.InstallmentState = InstallmentState;
exports.schema = schema;
