import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "./../../shared/PageHeader";
import { loadEmployee } from "./../../../actions/employeeActions";
import Fab from "./../../shared/Fab";
import defaultPic from "../../../img/defaultProfile.png";

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
      <div className="mx-4 mt-1">
        <div className="row">
          <div className="col s7 valign-wrapper">
            <img
              src={(employee && employee.photo) || defaultPic}
              alt=""
              className="responsive-img"
              style={{
                width: "150px",
                height: "150px"
              }}
            />
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
