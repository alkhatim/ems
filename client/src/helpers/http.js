import axios from "axios";
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

function setToken(token) {
  if (token) {
    axios.defaults.headers.common["x-jwt"] = token;
  } else delete axios.defaults.headers.common["x-jwt"];
}

function removeToken() {
  delete axios.defaults.headers.common["x-jwt"];
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setToken,
  removeToken
};
