const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  from: {
    type: new mongoose.Schema({
      username: {
        type: String,
        required: true
      }
    }),
    required: true
  },
  to: {
    type: [
      new mongoose.Schema({
        username: {
          type: String,
          required: true
        }
      })
    ],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  subject: {
    type: String
  },
  body: {
    type: String
  },
  url: {
    type: String
  },
  attachments: {
    type: [String]
  },
  hasAttachments: {
    type: Boolean,
    required: true,
    default: false
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  deadline: {
    type: Date
  }
});

const Message = mongoose.model("Message", schema);

const validate = function(message) {
  const schema = {
    to: Joi.array()
      .items(Joi.objectId())
      .min(1)
      .required(),
    subject: Joi.string(),
    body: Joi.string(),
    url: Joi.string(),
    attachments: Joi.array().items(Joi.string()),
    deadline: Joi.date().min(new Date()),
    read: Joi.boolean()
  };

  return Joi.validate(message, schema);
};

exports.Message = Message;
exports.validate = validate;
