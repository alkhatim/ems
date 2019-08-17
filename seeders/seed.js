module.exports = function() {
  require("./seedContracts")();
  require("./seedJobs")();
  require("./seedNationalities")();
  require("./seedUsers")();

  console.log("Done.");
};
