const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: stateSchema } = require("./State");
const { schema: deductionTypeSchema } = require("./DeductionType");

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
    type: deductionTypeSchema,
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

const Deduction = mongoose.model("Deduction", schema);

const validate = function(deduction) {
  const schema = {
    employeeId: Joi.objectId().required(),
    date: Joi.date()
      .max(Date.now())
      .required(),
    notes: Joi.string(),
    stateId: Joi.objectId(),
    typeId: Joi.objectId().required(),
    amount: Joi.number().required()
  };

  return Joi.validate(deduction, schema);
};

exports.Deduction = Deduction;
exports.validate = validate;
