const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: stateSchema } = require("./State");
const { schema: overtimeTypeSchema } = require("./OvertimeType");

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
  date: {
    type: Date,
    required: true,
    max: Date.now(),
    default: Date.now()
  },
  notes: {
    type: String,
    trim: true
  },
  state: {
    type: stateSchema,
    required: true
  },
  type: {
    type: overtimeTypeSchema,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const Overtime = mongoose.model("Overtime", schema);

const validate = function(overtime) {
  const schema = {
    employeeId: Joi.objectId().required(),
    date: Joi.date()
      .max(Date.now())
      .required(),
    notes: Joi.string(),
    typeId: Joi.objectId().required(),
    amount: Joi.number().required()
  };

  return Joi.validate(overtime, schema);
};

exports.Overtime = Overtime;
exports.validate = validate;
