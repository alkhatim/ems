const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: nationalitySchema } = require("../models/Nationality");
const { schema: jobSchema } = require("../models/Job");
const { schema: contractSchema } = require("../models/Contract");
const { schema: employeeStatusSchema } = require("../models/EmployeeStatus");
const { schema: genderSchema } = require("../models/gender");
const { schema: departmentSchema } = require("../models/Department");
const { schema: endOfServiceSchema } = require("../models/EndOfServiceReason");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 50,
    required: true
  },
  gender: {
    type: genderSchema,
    required: true
  },
  nationality: {
    type: nationalitySchema,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  phone: Number,
  email: {
    type: String,
    trim: true
  },
  bankAccount: Number,
  contract: {
    type: contractSchema,
    required: true
  },
  status: {
    type: employeeStatusSchema,
    required: true
  },
  jobInfo: {
    job: {
      type: jobSchema,
      required: true
    },
    department: {
      type: departmentSchema,
      required: true
    },
    dateOfEmployment: Date,
    contractExpiryDate: Date
  },
  salaryInfo: {
    basicSalary: {
      type: Number,
      required: true
    },
    livingExpenseAllowance: Number,
    housingAllowance: Number,
    transportAllowance: Number,
    foodAllowance: Number,
    totalSalary: {
      type: Number,
      required: true
    }
  },
  socialInsurance: {
    registered: Boolean,
    number: Number,
    socialInsuranceSalary: Number
  },
  serviceInfo: {
    endOfServiceDate: Date,
    endOfServiceReason: endOfServiceSchema,
    suspensionDate: Date,
    suspensionReason: String
  },
  vacationInfo: {
    total: Number,
    schedule: [Number]
  }
});

const Employee = mongoose.model("Employee", schema);

const validate = function(employee) {
  const schema = {
    name: Joi.string()
      .min(10)
      .max(50)
      .required(),
    genderId: Joi.objectId(),
    nationalityId: Joi.objectId().required(),
    birthday: Joi.date().required(),
    address: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.email().required(),
    jobId: Joi.objectId().required(),
    bankAccount: Joi.number(),
    contractId: Joi.objectId().required(),
    salaryInfo: Joi.object().keys({
      basicSalary: Joi.Number.min(0)
    }),
    salaryInfo: Joi.object().keys({
      basicSalary: Joi.Number.min(0).required()
    })
  };

  return Joi.validate(employee, schema);
};

exports.Employee = Employee;
exports.validate = validate;
