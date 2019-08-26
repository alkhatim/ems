const mongoose = require("mongoose");

async function seed() {
  // for (key in mongoose.connection.collections) {
  //   mongoose.connection.dropCollection(key);
  // }

  console.log("all done...");
}

module.exports = seed;

employeeJSON = {
  name: "mohammed alkhatim",
  genderId: "5d5e6b21cf308e1e10668be2",
  nationalityId: "5d5e6b20cf308e1e10668be0",
  birthday: "1996-03-26",
  address: "Khartoum-Arkaweet",
  phone: "0920012880",
  bankAccount: "1796861",
  contractId: "5d5e6b1bcf308e1e10668bde",
  jobId: "5d5e6b20cf308e1e10668bdf",
  departmentId: "5d5e6b21cf308e1e10668be1",
  contractExpiryDate: "2020-01-01",
  basicSalary: 1000,
  foodAllowance: 200
};
