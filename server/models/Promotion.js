const mongoose = require("mongoose");
const Joi = require("joi");

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
  percentage: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  }
});

const Promotion = mongoose.model("Promotion", schema);

const validate = function(promotion) {
  const schema = {
    employeeId: Joi.objectId().required(),
    notes: Joi.string(),
    percentage: Joi.number()
      .min(0)
      .max(1)
      .required()
  };

  return Joi.validate(promotion, schema);
};

exports.Promotion = Promotion;
exports.validate = validate;
