const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const LoanState = mongoose.model("LoanState", schema);

exports.LoanState = LoanState;
exports.schema = schema;
