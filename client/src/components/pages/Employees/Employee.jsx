import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "./../../shared/PageHeader";
import { loadEmployee } from "./../../../actions/employeeActions";
import Fab from "./../../shared/Fab";
import defaultPic from "../../../img/defaultProfile.png";
import TextInput from "./../../shared/TextInput";

const Employee = ({ match }) => {
  const employees = useSelector(store => store.employeeReducer.employees);

  const [editMode, setEditMode] = useState(false);
  const [employee, setEmployee] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (match.params.id) {
      if (employees)
        setEmployee(
          employees.find(employee => (employee._id = match.params.id))
        );
      else dispatch(loadEmployee(match.params.id));
    }
  }, [dispatch, match, employees]);

  const handleNew = () => {
    setEmployee(null);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="row">
      <PageHeader
        title="Employee Info"
        color="blue-text text-darken-2"
        icon="fa fa-address-card"
        url="/employee"
      />
      <div className="mx-4 mt-1">
        <div className="row">
          <div className="col s7 valign-wrapper">
            <img
              src={(employee && employee.photo) || defaultPic}
              alt=""
              className="responsive-img"
              style={{
                width: "150px",
                height: "150px",
                marginRight: "5rem"
              }}
            />
            <TextInput label="Name" name="name" />
          </div>
          <div className="col s2 valign-wrapper"></div>
          <div className="col s3"></div>
        </div>
      </div>
      <Fab color="blue darken-2" icon="fa fa-plus" onClick={handleNew} />
    </div>
  );
};

export default Employee;
