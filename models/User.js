const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  roles: [String]
});

const User = mongoose.model("User", schema);

const validate = function(user) {
  const schema = {
    username: Joi.string()
      .required()
      .min(5)
      .max(30),
    password: Joi.string()
      .required()
      .min(5)
      .max(255),
    roles: Joi.array()
      .items(Joi.string())
      .min(1)
      .unique()
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validate;
