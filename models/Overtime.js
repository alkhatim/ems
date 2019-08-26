const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: stateSchema } = require("./State");
const { schema: typeSchema } = require("./OvertimeType");

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
    max: new Date(),
    default: new Date()
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
    type: typeSchema,
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
    date: Joi.date().max(new Date()),
    notes: Joi.string().required(),
    typeId: Joi.objectId().required(),
    amount: Joi.number().required()
  };

  return Joi.validate(overtime, schema);
};

exports.Overtime = Overtime;
exports.validate = validate;
