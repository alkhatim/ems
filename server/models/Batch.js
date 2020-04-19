const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: stateSchema } = require("./State");
const { schema: typeSchema } = require("./BatchType");

const schema = new mongoose.Schema({
  notes: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: typeSchema,
    required: true
  },
  state: {
    type: stateSchema,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  employees: {
    type: [
      {
        name: {
          type: String,
          required: true
        },
        details: {
          type: {
            basicSalary: Number,
            housingAllowance: Number,
            transportAllowance: Number,
            livingExpenseAllowance: Number,
            foodAllowance: Number,
            totalSalary: Number,
            socialInsurance: Number,
            vat: Number,
            overtimes: Number,
            deductions: Number,
            loans: Number,
            vacations: Number,
            missions: Number,
            total: Number
          },
          required: true
        }
      }
    ],
    required: true
  },
  entries: {
    type: {
      overtimes: [mongoose.Schema.Types.ObjectId],
      deductions: [mongoose.Schema.Types.ObjectId],
      installments: [mongoose.Schema.Types.ObjectId],
      vacations: [mongoose.Schema.Types.ObjectId],
      missions: [mongoose.Schema.Types.ObjectId]
    },
    required: true
  }
});

const Batch = mongoose.model("Batch", schema);

const validate = function(batch) {
  const schema = {
    notes: Joi.string().required(),
    date: Joi.date().required(),
    typeId: Joi.objectId().required(),
    stateId: Joi.objectId(),
    employees: Joi.array().items(Joi.string()),
    departmentId: Joi.objectId(),
    locationId: Joi.objectId()
  };

  return Joi.validate(batch, schema);
};

exports.Batch = Batch;
exports.validate = validate;
