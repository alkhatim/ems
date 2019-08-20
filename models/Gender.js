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

const Gender = mongoose.model("Gender", schema);

exports.Gender = Gender;
exports.schema = schema;
