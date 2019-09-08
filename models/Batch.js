const mongoose = require("mongoose");
const Joi = require("Joi");
const { schema: typeSchema } = require("./BatchType");
const { schema: stateSchema } = require("./State");

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
  employees: [
    new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      batchDetails: [
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
