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
    required: true
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
    min: 1,
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
    notes: Joi.string(),
    stateId: Joi.objectId(),
    date: Joi.date().required(),
    typeId: Joi.objectId().required(),
    amount: Joi.number()
      .positive()
      .required()
  };

  return Joi.validate(overtime, schema);
};

exports.Overtime = Overtime;
exports.validate = validate;
