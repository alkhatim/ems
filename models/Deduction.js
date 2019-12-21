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
    min: 0,
    required: true
  }
});

const Deduction = mongoose.model("Deduction", schema);

const validate = function(deduction) {
  const schema = {
    employeeId: Joi.objectId().required(),
    notes: Joi.string(),
    stateId: Joi.objectId(),
    date: Joi.date().required(),
    typeId: Joi.objectId().required(),
    amount: Joi.number()
      .positive()
      .integer()
      .required()
  };

  return Joi.validate(deduction, schema);
};

exports.Deduction = Deduction;
exports.validate = validate;
