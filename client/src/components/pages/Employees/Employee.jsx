import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "./../../shared/PageHeader";
import { loadEmployee } from "./../../../actions/employeeActions";
import Fab from "./../../shared/Fab";

const Employee = ({ match }) => {
  const employees = useSelector(store => store.employeeReducer.employees);
  let employee =
    match.params.id &&
    employees.find(employee => (employee._id = match.params.id));

  const dispatch = useDispatch();

  useEffect(() => {
    if (match.params.id) {
      dispatch(loadEmployee(match.params.id));
    }
  }, [dispatch, match]);

  const handleNew = () => {
    employee = null;
  };

  return (
    <div className="row">
      <PageHeader
        title="Employee Info"
        color="blue-text text-darken-2"
        icon="fa fa-address-card"
        url="/employee"
      />
      <Fab color="blue darken-2" icon="fa fa-plus" onClick={handleNew} />
    </div>
  );
};

export default Employee;
