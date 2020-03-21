const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: nationalitySchema } = require("../models/Nationality");
const { schema: jobSchema } = require("../models/Job");
const { schema: contractSchema } = require("../models/Contract");
const { schema: statusSchema } = require("../models/EmployeeStatus");
const { schema: genderSchema } = require("../models/Gender");
const { schema: departmentSchema } = require("../models/Department");
const { schema: locationSchema } = require("../models/Location");

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
    max: new Date(),
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 13,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  bankAccount: {
    type: Number,
    minlength: 5,
    maxlength: 20
  },
  status: {
    type: statusSchema,
    required: true
  },
  jobInfo: {
    job: {
      type: jobSchema,
      required: true
    },
    contract: {
      type: contractSchema,
      required: true
    },
    department: {
      type: departmentSchema,
      required: true
    },
    location: {
      type: locationSchema,
      required: true
    },
    dateOfEmployment: Date,
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
    }
  },
  vacationInfo: {
    vacationDays: {
      type: Number,
      min: 0
    },
    vacationSchedule: [Date]
  },
  photo: String
});

schema.pre("save", function() {
  if (this.salaryInfo) {
    this.salaryInfo.totalSalary =
      this.salaryInfo.basicSalary +
      (this.salaryInfo.housingAllowance || 0) +
      (this.salaryInfo.livingExpenseAllowance || 0) +
      (this.salaryInfo.transportAllowance || 0) +
      (this.salaryInfo.foodAllowance || 0);
  }
});

schema.pre("update", function() {
  if (this.salaryInfo) {
    this.salaryInfo.totalSalary =
      this.salaryInfo.basicSalary +
      (this.salaryInfo.housingAllowance || 0) +
      (this.salaryInfo.livingExpenseAllowance || 0) +
      (this.salaryInfo.transportAllowance || 0) +
      (this.salaryInfo.foodAllowance || 0);
  }
});

schema.pre("updateOne", function() {
  if (this.salaryInfo) {
    this.salaryInfo.totalSalary =
      this.salaryInfo.basicSalary +
      (this.salaryInfo.housingAllowance || 0) +
      (this.salaryInfo.livingExpenseAllowance || 0) +
      (this.salaryInfo.transportAllowance || 0) +
      (this.salaryInfo.foodAllowance || 0);
  }
});

schema.pre("findOneAndUpdate", function() {
  if (this.salaryInfo) {
    this.salaryInfo.totalSalary =
      this.salaryInfo.basicSalary +
      (this.salaryInfo.housingAllowance || 0) +
      (this.salaryInfo.livingExpenseAllowance || 0) +
      (this.salaryInfo.transportAllowance || 0) +
      (this.salaryInfo.foodAllowance || 0);
  }
});

const Employee = mongoose.model("Employee", schema);

const validate = function(employee) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    genderId: Joi.objectId().required(),
    nationalityId: Joi.objectId().required(),
    birthday: Joi.date()
      .max(new Date())
      .required(),
    address: Joi.string(),
    phone: Joi.string()
      .min(9)
      .max(13)
      .required(),
    email: Joi.string().email(),
    bankAccount: Joi.number()
      .integer()
      .positive(),
    jobId: Joi.objectId().required(),
    contractId: Joi.objectId().required(),
    departmentId: Joi.objectId().required(),
    locationId: Joi.objectId().required(),
    dateOfEmployment: Joi.date(),
    contractExpiryDate: Joi.date(),
    basicSalary: Joi.number()
      .positive()
      .required(),
    livingExpenseAllowance: Joi.number().positive(),
    housingAllowance: Joi.number().positive(),
    transportAllowance: Joi.number().positive(),
    foodAllowance: Joi.number().positive(),
    registered: Joi.boolean(),
    socialInsuranceNumber: Joi.number()
      .integer()
      .positive(),
    socialInsuranceSalary: Joi.number().positive(),
    endOfServiceDate: Joi.date(),
    endOfServiceReason: Joi.string(),
    vacationDays: Joi.number()
      .positive()
      .integer(),
    vacationSchedule: Joi.array().items(
      Joi.number()
        .integer()
        .min(1)
        .max(12)
    ),
    photo: Joi.string().allow("")
  };

  return Joi.validate(employee, schema);
};

exports.Employee = Employee;
exports.validate = validate;
