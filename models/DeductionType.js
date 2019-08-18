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

const DeductionType = mongoose.model("DeductionType", schema);

exports.DeductionType = DeductionType;
exports.schema = schema;
