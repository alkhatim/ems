const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin"]
  }
});

schema.methods.genJwt = function() {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role
    },
    config.get("jwtSecret")
  );
};
const User = mongoose.model("User", schema);

const validate = function(user) {
  const schema = {
    username: Joi.string()
      .required()
      .min(4)
      .max(30),
    password: new PasswordComplexity({
      min: 6,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirmentCount: 3
    }),
    avatar: Joi.string().allow(""),
    role: Joi.string().valid("user", "admin")
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validate;
