import types from "../actions/types";

const initialState = {
  employees: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.EMPLOYEE_LOADED:
      return {
        ...state,
        employees: state.employees.concat(payload),
      };

    case types.EMPLOYEE_LOAD_FAILED:
      return state;

    default:
      return state;
  }
}
