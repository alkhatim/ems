import { EMPLOYEE_LOADED, EMPLOYEE_LOAD_FAILED } from "../actions/types";

const initialState = {
  employees: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case EMPLOYEE_LOADED:
      return {
        ...state,
        employees: state.employees.concat(payload),
      };

    case EMPLOYEE_LOAD_FAILED:
      return state;

    default:
      return state;
  }
}
