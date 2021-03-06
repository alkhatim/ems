const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const DeductionType = mongoose.model("DeductionType", schema);

exports.DeductionType = DeductionType;
exports.schema = schema;
