const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: typeSchema } = require("./VacationType");
const { schema: stateSchema } = require("./VacationState");

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
  startDate: {
    type: Date
  },
  endDate: Date,
  actualEndDate: Date,
  duration: {
    type: Number,
    min: 1,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  state: {
    type: stateSchema,
    required: true
  },
  type: {
    type: typeSchema,
    required: true
  },
  replacementEmployee: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      }
    })
  }
});

const Vacation = mongoose.model("Vacation", schema);

const validate = function(vacation) {
  const schema = {
    employeeId: Joi.objectId().required(),
    startDate: Joi.date(),
    duration: Joi.number()
      .integer()
      .positive()
      .required(),
    notes: Joi.string(),
    stateId: Joi.objectId(),
    typeId: Joi.objectId().required(),
    replacementEmployeeId: Joi.objectId()
  };

  return Joi.validate(vacation, schema);
};

exports.Vacation = Vacation;
exports.validate = validate;
