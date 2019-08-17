const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  }
});

const X = mongoose.model("X", schema);

const validate = function(x) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(30)
  };

  return Joi.validate(x, schema);
};

exports.X = X;
exports.validate = validate;
