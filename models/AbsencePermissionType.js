const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  }
});

const AbsencePermissionType = mongoose.model("AbsencePermissionType", schema);

exports.AbsencePermissionType = AbsencePermissionType;
exports.schema = schema;
