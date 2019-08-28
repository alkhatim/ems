const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const Nationality = mongoose.model("Nationality", schema);

exports.Nationality = Nationality;
exports.schema = schema;
