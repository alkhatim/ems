import http from "../services/http";
import { EMPLOYEE_LOADED, EMPLOYEE_LOAD_FAILED } from "./ActionTypes";
import messages from "../services/messages";

export const loadEmployee = employeeId => async dispatch => {
  try {
    const res = await http.get("/employees/" + employeeId);
    const employee = res.data;
    console.log(employee);
    dispatch({
      type: EMPLOYEE_LOADED,
      payload: employee
    });
  } catch (error) {
    messages.error(error);
    dispatch({
      type: EMPLOYEE_LOAD_FAILED
    });
  }
};
