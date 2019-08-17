const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");
const { schema: nationalitySchema } = require("../models/Nationality");
const { schema: jobSchema } = require("../models/Job");
const { schema: contractSchema } = require("../models/Contract");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    get: () => moment.duration(Date.now() - this.birthday).years()
  },
  nationality: {
    type: nationalitySchema,
    required: true
  },
  job: {
    type: jobSchema,
    required: true
  },
  contract: {
    type: contractSchema,
    required: true
  }
});

const Employee = mongoose.model("Employee", schema);

const validate = function(employee) {
  const schema = {
    name: Joi.string().required(),
    address: Joi.string().required(),
    birthday: Joi.date().required(),
    age: Joi.number().required(),
    nationalityId: Joi.objectId().required(),
    jobId: Joi.objectId().required(),
    contractId: Joi.objectId().required()
  };

  return Joi.validate(employee, schema);
};

exports.Employee = Employee;
exports.validate = validate;
