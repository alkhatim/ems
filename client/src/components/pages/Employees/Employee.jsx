import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "./../../shared/PageHeader";
import { loadEmployee } from "./../../../actions/employeeActions";

const Employee = props => {
  const { match } = props;

  const employees = useSelector(store => store.employeeReducer.employees);

  const [employee, setEmployee] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (match.params.id) {
      dispatch(loadEmployee(match.params.id));
    }
  }, [dispatch, match]);

  return (
    <div className="row">
      <PageHeader
        title="Employee Info"
        color="blue-text text-darken-2"
        icon="fa fa-address-card"
        url="/employee"
      />
    </div>
  );
};

export default Employee;
