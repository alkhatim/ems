import axios from "axios";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("Somthing failed on the server! Try again later", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000
    });
  }
  return Promise.reject(error);
});

const setToken = token => {
  if (token) {
    axios.defaults.headers.common["x-jwt"] = token;
  } else delete axios.defaults.headers.common["x-jwt"];
};

const loadUser = () => async dispatch => {
  const token = localStorage.getItem("jwt");

  if (!token)
    return dispatch({
      type: LOGIN_FAIL
    });

  setToken(token);

  try {
    const res = await axios.get("/api/logins");
    const user = res.data;
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token,
        user
      }
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setToken,
  loadUser
};
