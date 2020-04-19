const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const VacationType = mongoose.model("VacationType", schema);

exports.VacationType = VacationType;
exports.schema = schema;
