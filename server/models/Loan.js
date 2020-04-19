const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: installmentStateSchema } = require("./InstallmentState");
const { schema: stateSchema } = require("./LoanState");
const { LoanState: State } = require("./LoanState");

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
  state: {
    type: stateSchema,
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
          type: installmentStateSchema,
          required: true
        }
      }
    ],
    required: true
  }
});

schema.pre("save", async function() {
  if (this.installments.filter(i => i.state.name == "Pending").length == 0)
    this.state = await State.findOne({ name: "Closed" });
});

schema.pre("update", async function() {
  if (this.installments.filter(i => i.state.name == "Pending").length == 0)
    this.state = await State.findOne({ name: "Closed" });
});

schema.pre("updateOne", async function() {
  if (this.installments.filter(i => i.state.name == "Pending").length == 0)
    this.state = await State.findOne({ name: "Closed" });
});

schema.pre("findOneAndUpdate", async function() {
  if (this.installments.filter(i => i.state.name == "Pending").length == 0)
    this.state = await State.findOne({ name: "Closed" });
});

const Loan = mongoose.model("Loan", schema);

const validate = function(loan) {
  const schema = {
    employeeId: Joi.objectId().required(),
    date: Joi.date().required(),
    firstPayDate: Joi.date()
      .min(Joi.ref("date"))
      .required(),
    amount: Joi.number()
      .positive()
      .required(),
    installmentAmount: Joi.number()
      .max(Joi.ref("amount"))
      .positive()
      .required()
  };
  return Joi.validate(loan, schema);
};

module.exports.Loan = Loan;
module.exports.validate = validate;
