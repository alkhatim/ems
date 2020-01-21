const moment = require("moment");
const config = require("config");
const { Employee } = require("../models/Employee");
const { Overtime } = require("../models/Overtime");
const { Deduction } = require("../models/Deduction");
const { Loan } = require("../models/Loan");

const calculateSalary = async function(employeeId, date) {
  //#region declarations
  const employee = await Employee.findById(employeeId).select(
    "name salaryInfo socialInsuranceInfo"
  );
  const batchEmployee = {};
  batchEmployee._id = employee._id;
  batchEmployee.name = employee.name;
  batchEmployee.details = {};
  //#endregion

  //#region salary
  const salaryRatio =
    (30 -
      (30 -
        moment(date)
          .toDate()
          .getDate())) /
    30;

  if (
    moment(date)
      .toDate()
      .getDate() == 31
  )
    salaryRatio = 1;

  if (!salaryRatio) return res.status(400).send("Enter a correct batch date");

  batchEmployee.details.basicSalary =
    employee.salaryInfo.basicSalary * salaryRatio;

  if (employee.salaryInfo.livingExpenseAllowance)
    batchEmployee.details.livingExpenseAllowance =
      employee.salaryInfo.livingExpenseAllowance * salaryRatio;

  if (employee.salaryInfo.housingAllowance)
    batchEmployee.details.housingAllowance =
      employee.salaryInfo.housingAllowance * salaryRatio;

  if (employee.salaryInfo.transportAllowance)
    batchEmployee.details.transportAllowance =
      employee.salaryInfo.transportAllowance * salaryRatio;

  if (employee.salaryInfo.foodAllowance)
    batchEmployee.details.foodAllowance =
      employee.salaryInfo.foodAllowance * salaryRatio;

  batchEmployee.details.totalSalary =
    employee.salaryInfo.totalSalary * salaryRatio;

  batchEmployee.details.vat =
    employee.salaryInfo.totalSalary * config.get("vat");

  const registered = employee.socialInsuranceInfo.registered;
  const socialInsuranceSalary =
    employee.socialInsuranceInfo.socialInsuranceSalary ||
    employee.salaryInfo.totalSalary;

  batchEmployee.details.socialInsurance = registered
    ? socialInsuranceSalary * config.get("employeeSocialInsurance")
    : null;
  //#endregion

  //#region overtimes
  const overtimes = await Overtime.find({
    "employee._id": employee._id,
    date: { $lte: date },
    "state.name": "Approved"
  });
  if (overtimes) {
    batchEmployee.details.overtimes = 0;
    overtimes.forEach(overtime => {
      batchEmployee.details.overtimes += overtime.total;
    });
  }
  //#endregion

  //#region deductions
  const deductions = await Deduction.find({
    "employee._id": employee._id,
    date: { $lte: date },
    "type.name": { $ne: "Warning" },
    "state.name": "Approved"
  });
  if (deductions) {
    batchEmployee.details.deductions = 0;
    for (deduction of deductions) {
      const permissions = await AbsencePermission.find({
        "employee._id": employee._id,
        "type._id": deduction.type._id,
        "state.name": "Approved"
      });
      const currentPermission = permissions.filter(
        p =>
          moment(deduction.date).isBetween(
            moment(p.date),
            moment(p.date).add(p.amount, "days"),
            null,
            "[]"
          ) && deduction.amount <= p.amount
      );
      if (!currentPermission.length)
        batchEmployee.details.deductions += deduction.total;
    }
  }
  //#endregion

  //#region loans
  const loan = await Loan.findOne({
    "employee._id": employee._id,
    "state.name": "Approved"
  });
  if (loan) {
    const installments = loan.installments.filter(
      i =>
        i.state.name == "Pending" &&
        i.date <=
          moment(date)
            .endOf("month")
            .toDate()
    );
    if (installments) {
      batchEmployee.details.loans = 0;
      installments.forEach(installment => {
        batchEmployee.details.loans += installment.amount;
      });
    }
  }
  //#endregion

  batchEmployee.details.total =
    batchEmployee.details.totalSalary -
    batchEmployee.details.socialInsurance -
    batchEmployee.details.vat +
    (batchEmployee.details.overtimes || 0) -
    (batchEmployee.details.deductions || 0) -
    (batchEmployee.details.loans || 0);

  return batchEmployee;
};

module.exports = calculateSalary;
