const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  employee: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  totalCredit: {
    type: Number,
    required: true
  },
  remainingCredit: {
    type: Number,
    required: true
  },
  consumedCredit: {
    type: Number,
    required: true
  },
  soldCredit: {
    type: Number,
    required: true
  }
});

const VacationCredit = mongoose.model("VacationCredit", schema);

exports.VacationCredit = VacationCredit;
exports.schema = schema;
