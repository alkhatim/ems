const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  }
});

const Nationality = mongoose.model("Nationality", schema, "Nationalities");

exports.Nationality = Nationality;
exports.schema = schema;
