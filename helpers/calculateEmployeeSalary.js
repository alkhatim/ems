const moment = require("moment");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Loan } = require("../models/Loan");

const calculateEmployeeSalary = async function(employee, date) {
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
  salary.overtime = 0;
  overtimes.forEach(overtime => {
    salary.overtime += overtime.total;
  });

  // deductions
  const deductions = await Deduction.find({
    "employee._id": employee._id,
    date: { $lt: date },
    "state.name": { $eq: "Approved" }
  });
  salary.deduction = 0;
  deductions.forEach(deduction => {
    salary.deduction += deduction.total;
  });

  // loan
  const loan = await Loan.findOne({
    "employee._id": employee._id,
    "installments.state.name": "Pending",
    "installments.date": moment(date)
      .endOf("month")
      .toDate()
  });
  const installment = loan.installments.find(i => i.state.name == "Pending");
  salary.loan = installment.amount;

  //total
  salary.total =
    salary.totalSalary + salary.overtime - salary.deduction - salary.loan;

  return salary;
};

module.exports = calculateEmployeeSalary;
