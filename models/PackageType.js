const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const PackageType = mongoose.model("PackageType", schema);

exports.PackageType = PackageType;
exports.schema = schema;
