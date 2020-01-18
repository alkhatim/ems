import jwtDecode from "jwt-decode";
import http from "./httpService";

http.setToken(localStorage.getItem("jwt"));

export async function login(username, password) {
  const res = await http.post("/api/login", { username, password });
  const token = res.headers["x-jwt"];
  localStorage.setItem("jwt", token);
}

export function logout() {
  localStorage.removeItem("jwt");
}

export function getUser() {
  try {
    const token = localStorage.getItem("jwt");
    return jwtDecode(token);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  getUser
};
