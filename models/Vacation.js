const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: typeSchema } = require("./VacationType");
const { schema: stateSchema } = require("./State");

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
    type: Date,
    required: true,
    min: new Date(),
    default: new Date()
  },
  endDate: {
    type: Date,
    min: new Date(),
    required: function() {
      return !this.duration;
    }
  },
  duration: {
    type: Number,
    min: 0,
    required: function() {
      return !this.endDate;
    }
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
  const schema = Joi.object().keys({
    employeeId: Joi.objectId().required(),
    startDate: Joi.date()
      .min(new Date())
      .required(),
    duration: Joi.number().required(),
    notes: Joi.string(),
    stateId: Joi.objectId(),
    typeId: Joi.objectId().required(),
    replacementEmployeeId: Joi.objectId()
  });

  return Joi.validate(vacation, schema);
};

exports.Vacation = Vacation;
exports.validate = validate;
