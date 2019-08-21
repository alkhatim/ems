const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: nationalitySchema } = require("../models/Nationality");
const { schema: jobSchema } = require("../models/Job");
const { schema: contractSchema } = require("../models/Contract");
const { schema: employeeStatusSchema } = require("../models/EmployeeStatus");
const { schema: genderSchema } = require("../models/Gender");
const { schema: departmentSchema } = require("../models/Department");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 3,
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
    max: Date.now(),
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: Number,
    minlength: 9,
    maxlength: 12
  },
  email: {
    type: String,
    trim: true
  },
  bankAccount: {
    type: Number,
    min: 5,
    max: 20
  },
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
    dateOfEmployment: {
      type: Date,
      max: Date.now()
    },
    contractExpiryDate: Date
  },
  salaryInfo: {
    basicSalary: {
      type: Number,
      min: 0,
      required: true
    },
    livingExpenseAllowance: {
      type: Number,
      min: 0
    },
    housingAllowance: {
      type: Number,
      min: 0
    },
    transportAllowance: {
      type: Number,
      min: 0
    },
    foodAllowance: {
      type: Number,
      min: 0
    },
    totalSalary: {
      type: Number,
      min: 0,
      required: true
    }
  },
  socialInsuranceInfo: {
    registered: Boolean,
    socialInsuranceNumber: Number,
    socialInsuranceSalary: {
      type: Number,
      min: 0
    }
  },
  serviceInfo: {
    endOfServiceDate: Date,
    endOfServiceReason: {
      type: String,
      trim: true
    },
    suspensionDate: Date,
    suspensionReason: {
      type: String,
      trim: true
    }
  },
  vacationInfo: {
    vacationDays: {
      type: Number,
      min: 0
    },
    vacationSchedule: [Number]
  }
});

schema.pre("validate", function(next) {
  this.salaryInfo.totalSalary =
    this.salaryInfo.basicSalary +
    this.salaryInfo.housingAllowance +
    this.salaryInfo.livingExpenseAllowance +
    this.salaryInfo.transportAllowance +
    this.salaryInfo.foodAllowance;
  next();
});

const Employee = mongoose.model("Employee", schema);

const validate = function(employee) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    genderId: Joi.objectId(),
    nationalityId: Joi.objectId().required(),
    birthday: Joi.date()
      .max(Date.now())
      .required(),
    address: Joi.string(),
    phone: Joi.number()
      .min(9)
      .max(12)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    bankAccount: Joi.number()
      .min(5)
      .max(20),
    contractId: Joi.objectId().required(),
    statusId: Joi.objectId().required(),
    jobInfo: Joi.object().keys({
      jobId: Joi.objectId().required(),
      departmentId: Joi.objectId().required(),
      dateOfEmployment: Joi.date().max(Date.now()),
      contractExpiryDate: Joi.date()
    }),
    salaryInfo: Joi.object().keys({
      basicSalary: Joi.number()
        .min(0)
        .required(),
      livingExpenseAllowance: Joi.number().min(0),
      housingAllowance: Joi.number().min(0),
      transportAllowance: Joi.number().min(0),
      foodAllowance: Joi.number()
        .min(0)
        .required()
    }),
    socialInsuranceInfo: Joi.object().keys({
      registered: Joi.boolean(),
      socialInsuranceNumber: Joi.number(),
      socialInsuranceSalary: Joi.number().min(0)
    }),
    serviceInfo: Joi.object().keys({
      endOfServiceDate: Joi.date(),
      endOfServiceReason: Joi.string(),
      suspensionDate: Joi.date(),
      suspensionReason: Joi.string()
    }),
    vacationInfo: Joi.object().keys({
      vacationDays: Joi.number().min(0),
      vacationSchedule: Joi.array().items(Joi.number())
    })
  };

  return Joi.validate(employee, schema);
};

exports.Employee = Employee;
exports.validate = validate;
