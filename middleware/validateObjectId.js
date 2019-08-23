const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = function(req, res, next) {
  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send("The given Id is not valdid");
  next();
};
