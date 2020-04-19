const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const VacationState = mongoose.model("VacationState", schema);

exports.VacationState = VacationState;
exports.schema = schema;
