const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: stateSchema } = require("./InstallmentState");

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
  date: {
    type: Date,
    min: new Date().setHours(0, 0, 0, 0),
    required: true
  },
  firstPayDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    min: 1,
    required: true
  },
  installments: {
    type: [
      {
        date: {
          type: Date,
          required: true
        },
        amount: {
          type: Number,
          min: 1,
          required: true
        },
        state: {
          type: stateSchema,
          required: true
        }
      }
    ],
    required: true
  }
});

const Loan = mongoose.model("Loan", schema);

const validate = function(loan) {
  const schema = {
    employeeId: Joi.objectId().required(),
    date: Joi.date().min(new Date().setHours(0, 0, 0, 0)),
    firstPayDate: Joi.date()
      .min(Joi.ref("date"))
      .required(),
    amount: Joi.number()
      .positive()
      .required(),
    installmentAmount: Joi.number()
      .min(1)
      .required()
  };
  return Joi.validate(loan, schema);
};

module.exports.Loan = Loan;
module.exports.validate = validate;
