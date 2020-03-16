import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "./../../shared/PageHeader";
import { loadEmployee } from "./../../../actions/employeeActions";
import Fab from "./../../shared/Fab";
import defaultPic from "../../../img/defaultProfile.png";
import TextInput from "./../../shared/TextInput";

const Employee = props => {
  const employees = useSelector(store => store.employeeReducer.employees);

  const [editMode, setEditMode] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    gender: {},
    nationality: {},
    birthday: "",
    address: "",
    phone: "",
    email: "",
    bankAccount: "",
    status: {},
    jobInfo: {
      job: {},
      contract: {},
      department: {},
      location: {},
      dateOfEmployment: ""
    },
    salaryInfo: {
      basicSalary: "",
      livingExpenseAllowance: "",
      housingAllowance: "",
      transportAllowance: "",
      foodAllowance: "",
      totalSalary: ""
    },
    socialInsuranceInfo: {
      registered: false,
      socialInsuranceNumber: "",
      socialInsuranceSalary: ""
    },
    serviceInfo: {
      endOfServiceDate: "",
      endOfServiceReason: ""
    },
    vacationInfo: {
      vacationDays: "",
      vacationSchedule: []
    },
    photo: ""
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.match.params.id) {
      if (employees.find(employee => employee._id === props.match.params.id))
        setEmployee(
          employees.find(employee => employee._id === props.match.params.id)
        );
      else dispatch(loadEmployee(props.match.params.id));
    }
  }, [dispatch, props.match, employees]);

  const handleNew = () => {
    setEmployee({
      name: "",
      gender: {},
      nationality: {},
      birthday: "",
      address: "",
      phone: "",
      email: "",
      bankAccount: "",
      status: {},
      jobInfo: {
        job: {},
        contract: {},
        department: {},
        location: {},
        dateOfEmployment: ""
      },
      salaryInfo: {
        basicSalary: "",
        livingExpenseAllowance: "",
        housingAllowance: "",
        transportAllowance: "",
        foodAllowance: "",
        totalSalary: ""
      },
      socialInsuranceInfo: {
        registered: false,
        socialInsuranceNumber: "",
        socialInsuranceSalary: ""
      },
      serviceInfo: {
        endOfServiceDate: "",
        endOfServiceReason: ""
      },
      vacationInfo: {
        vacationDays: "",
        vacationSchedule: []
      },
      photo: ""
    });
    props.history.push("/employee");
  };

  const handleChange = e => {
    setEmployee({ ...employee, name: e.target.value });
  };

  const handletoggleEditMode = () => {
    console.log("object");
    setEditMode(!editMode);
  };

  const handleSave = () => {};

  const actions = [
    {
      label: "Edit",
      icon: "blue-text text-darken-2 fa fa-edit fa-2x",
      onClick: handletoggleEditMode
    },
    {
      label: "Save",
      icon: "blue-text text-darken-2 fa fa-save fa-2x",
      onClick: handleSave
    }
  ];

  return (
    <div className="row">
      <PageHeader
        title="Employee Info"
        color="blue-text text-darken-2"
        icon="fa fa-address-card"
        url={props.match.url}
        actions={actions}
      />
      <div className="mx-4 mt-1">
        <div className="row">
          <div className="col s5 valign-wrapper">
            <img
              src={employee.photo || defaultPic}
              alt=""
              className="responsive-img img-150 mr-3"
            />
            <TextInput
              label="Name"
              name="name"
              disabled={!editMode}
              value={employee.name}
              onChange={handleChange}
            />
          </div>
          <div className="col s2"></div>
          <div className="col s5"></div>
        </div>
      </div>
      <Fab color="blue darken-2" icon="fa fa-plus" onClick={handleNew} />
    </div>
  );
};

export default Employee;
