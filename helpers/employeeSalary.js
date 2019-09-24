const moment = require("moment");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Loan } = require("../models/Loan");

const employeeSalary = async function(employee, date) {
  const salary = {};
  // salary
  salary.basicSalary = employee.salaryInfo.basicSalary;

  if (employee.salaryInfo.livingExpenseAllowance)
    salary.livingExpenseAllowance = employee.salaryInfo.livingExpenseAllowance;

  if (employee.salaryInfo.livingExpenseAllowance)
    salary.livingExpenseAllowance = employee.salaryInfo.livingExpenseAllowance;

  if (employee.salaryInfo.housingAllowance)
    salary.housingAllowance = employee.salaryInfo.housingAllowance;

  if (employee.salaryInfo.transportAllowance)
    salary.transportAllowance = employee.salaryInfo.transportAllowance;

  if (employee.salaryInfo.foodAllowance)
    salary.foodAllowance = employee.salaryInfo.foodAllowance;

  salary.totalSalary = employee.salaryInfo.totalSalary;

  // overtimes
  const overtimes = await Overtime.find({
    "employee._id": employee._id,
    date: { $lt: date },
    "state.name": { $eq: "Approved" }
  });
  if (overtimes) {
    salary.overtimes = 0;
    overtimes.forEach(overtime => {
      salary.overtimes += overtime.total;
    });
  }

  // deductions
  const deductions = await Deduction.find({
    "employee._id": employee._id,
    date: { $lt: date },
    "state.name": { $eq: "Approved" }
  });
  if (deductions) {
    salary.deductions = 0;
    deductions.forEach(deduction => {
      salary.deductions += deduction.total;
    });
  }

  // loan
  const loan = await Loan.findOne({
    "employee._id": employee._id,
    "installments.state.name": "Pending",
    "installments.date": moment(date)
      .endOf("month")
      .toDate()
  });
  if (loan) {
    const installment = loan.installments.find(
      i =>
        i.state.name == "Pending" &&
        i.date.getMonth() == new Date(date).getMonth()
    );

    salary.loan = installment.amount;
  }

  //total
  salary.total =
    salary.totalSalary +
    (salary.overtimes || 0) -
    (salary.deductions || 0) -
    (salary.loan || 0);
  return salary;
};

module.exports = employeeSalary;
