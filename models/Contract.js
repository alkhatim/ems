const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  }
});

const Contract = mongoose.model("Contract", schema);

exports.Contract = Contract;
exports.schema = schema;
