const mongoose = require("mongoose");
const Joi = require("joi");
const { schema: typeSchema } = require("./AbsencePermissionType");

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
  type: {
    type: typeSchema,
    required: true
  },
  amount: {
    type: Number,
    min: 0,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
});

const AbsencePermission = mongoose.model("AbsencePermission", schema);

const validate = function(absencePermission) {
  const schema = {
    employeeId: Joi.objectId().required(),
    date: Joi.date().required(),
    typeId: Joi.objectId().required(),
    amount: Joi.number()
      .min(0)
      .required(),
    notes: Joi.string()
  };

  return Joi.validate(absencePermission, schema);
};

exports.AbsencePermission = AbsencePermission;
exports.validate = validate;
