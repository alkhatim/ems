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
  employees: [
    new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      payments: [
        {
          name: {
            type: String,
            required: true
          },
          amount: {
            type: Number,
            required: true
          }
        }
      ]
    })
  ]
});

const Batch = mongoose.model("Batch", schema);

const validate = function(batch) {
  const schema = {
    notes: Joi.string().required(),
    date: Joi.date().required(),
    typeId: Joi.objectId().required(),
    stateId: Joi.objectId(),
    employees: Joi.array(),
    departmentId: Joi.objectId()
  };

  return Joi.validate(batch, schema);
};

exports.Batch = Batch;
exports.validate = validate;
