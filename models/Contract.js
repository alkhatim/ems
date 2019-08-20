const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    unique: true
  }
});

const Contract = mongoose.model("Contract", schema);

exports.Contract = Contract;
exports.schema = schema;
