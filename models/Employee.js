const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");
const { schema: nationalitySchema } = require("../models/Nationality");
const { schema: jobSchema } = require("../models/Job");
const { schema: contractSchema } = require("../models/Contract");
const { schema: employeeStatusSchema } = require("../models/EmployeeStatus");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 50,
    required: true
  },
  address: {
    type: String,
    trim: true,
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
  },
  properties: [
    new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      dataType: {
        type: String,
        required: true
      },
      value: {
        type: mongoose.SchemaTypes.Mixed,
        required: false
      }
    })
  ],
  status: {
    type: employeeStatusSchema,
    required: true
  }
});

const Employee = mongoose.model("Employee", schema);

const validate = function(employee) {
  const schema = {
    name: Joi.string()
      .min(10)
      .max(50)
      .required(),
    address: Joi.string().required(),
    birthday: Joi.date().required(),
    nationalityId: Joi.objectId().required(),
    jobId: Joi.objectId().required(),
    contractId: Joi.objectId().required()
  };

  return Joi.validate(employee, schema);
};

exports.Employee = Employee;
exports.validate = validate;
