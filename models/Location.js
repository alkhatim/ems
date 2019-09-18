const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const Location = mongoose.model("Location", schema);

exports.Location = Location;
exports.schema = schema;
