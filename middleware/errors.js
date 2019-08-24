module.exports = function(err, req, res, next) {
  console.log(err);
  res.status(500).send("Something failed on the server, try again later!");
};
