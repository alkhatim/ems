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

const Nationality = mongoose.model("Nationality", schema);

exports.Nationality = Nationality;
exports.schema = schema;
