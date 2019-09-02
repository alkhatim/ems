const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  destination: {
    type: String,
    minlength: 3,
    maxlength: 30,
    trim: true,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    required: true
  },
  startDate: {
    type: Date,
    min: new Date(),
    required: true
  },
  endDate: {
    type: Date,
    min: new Date(),
    required: true
  },
  actualEndDate: {
    type: Date
  },
  expense: {
    type: Number,
    min: 1,
    required: true
  },
  actualExpense: {
    type: Number,
    min: 0
  },
  employees: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
      },
      allowance: {
        type: Number,
        min: 0,
        required: true
      },
      isHead: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  ]
});

const Mission = mongoose.model("Mission", schema);

const validate = function(mission) {
  const schema = {
    destination: Joi.string()
      .min(3)
      .max(30)
      .required(),
    notes: Joi.string().required(),
    startDate: Joi.date()
      .min(new Date())
      .required(),
    endDate: Joi.date()
      .min(Joi.ref("startDate"))
      .required(),
    actualEndDate: Joi.date().min(Joi.ref("startDate")),
    expense: Joi.number()
      .positive()
      .required(),
    actualExpense: Joi.number().min(0),
    employees: Joi.array()
      .min(1)
      .items(
        Joi.object().keys({
          _id: Joi.objectId().required(),
          name: Joi.string()
            .min(3)
            .max(50)
            .required(),
          allowance: Joi.number()
            .min(0)
            .required(),
          isHead: Joi.boolean()
        })
      )
  };
  return Joi.validate(mission, schema);
};

module.exports.Mission = Mission;
module.exports.validate = validate;
