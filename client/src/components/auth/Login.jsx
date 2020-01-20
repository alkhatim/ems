import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import messages from "../../helpers/messages";
import { LOGIN_SUCCESS, LOGIN_FAIL } from "../../actions/types";
import http from "../../helpers/http";

export const Login = () => {
  const [formData, setformData] = useState({
    username: "",
    password: ""
  });

  const { username, password } = formData;

  const dispatch = useDispatch();

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await http.post("/api/logins", { username, password });
      const user = res.data;
      const token = res.headers["x-jwt"];
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token,
          user
        }
      });
    } catch (error) {
      messages.error(error);
      dispatch({
        type: LOGIN_FAIL
      });
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row center">
          <h1 className="center teal-text mt-4 mb-2">Login</h1>
          <p className="flow-text teal-text">
            <i className="fas fa-sign-in-alt mr-1 mb-1"></i>Sign Into Your
            Account
          </p>
          <div className="col s6 offset-s3 card">
            <div className="card-content">
              <form onSubmit={e => onSubmit(e)}>
                <div className="input-field">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={e => onChange(e)}
                    className="validate"
                    required
                  />
                  <label htmlFor="username">Usernmae</label>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={e => onChange(e)}
                    className="validate"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="input-field center">
                  <button type="submit" className="btn btn-large">
                    Login
                  </button>
                </div>
              </form>
              <p>
                Don't have an account ? &nbsp;
                <Link to="/register" className="teal-text text-darken-2">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
