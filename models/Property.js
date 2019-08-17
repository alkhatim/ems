const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  dataType: {
    type: String,
    required: true
  }
});

const Property = mongoose.model("Property", schema);

exports.Property = Property;
exports.schema = schema;
