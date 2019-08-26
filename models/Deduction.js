const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: stateSchema } = require("./State");
const { schema: typeSchema } = require("./DeductionType");

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
    default: new Date(),
    max: new Date()
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

const Deduction = mongoose.model("Deduction", schema);

const validate = function(deduction) {
  const schema = {
    employeeId: Joi.objectId().required(),
    notes: Joi.string(),
    stateId: Joi.objectId(),
    date: Joi.date().max(new Date()),
    typeId: Joi.objectId().required(),
    amount: Joi.number().required()
  };

  return Joi.validate(deduction, schema);
};

exports.Deduction = Deduction;
exports.validate = validate;
