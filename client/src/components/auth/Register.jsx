import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "../../actions/types";
import http from "../../helpers/http";
import messages from "../../helpers/messages";
import { Link, Redirect } from "react-router-dom";

export const Register = () => {
  const [formData, setformData] = useState({
    username: "",
    password: "",
    password2: ""
  });

  const { username, password, password2 } = formData;

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await http.post("/api/users", { username, password });
      const user = res.data;
      const token = res.headers["x-jwt"];
      dispatch({
        type: REGISTER_SUCCESS,
        payload: {
          token,
          user
        }
      });
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL
      });
      messages.error(error);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row center">
          <h1 className="center teal-text mt-4 mb-2">Sign Up</h1>
          <p className="flow-text teal-text">
            <i className="fas fa-sign-in-alt mr-1 mb-1"></i> Register a new
            account
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
                <div className="input-field">
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    value={password2}
                    onChange={e => onChange(e)}
                    className="validate"
                    required
                  />
                  <label htmlFor="password">Confirm Password</label>
                </div>
                <div className="input-field center">
                  <button type="submit" className="btn btn-large">
                    Login
                  </button>
                </div>
              </form>
              <p>
                Already registered ? &nbsp;
                <Link to="/login" className="teal-text text-darken-2">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
