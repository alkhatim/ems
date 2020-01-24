import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../actions/authActions";

export const Login = props => {
  const [formData, setformData] = useState({
    username: "",
    password: ""
  });

  const { username, password } = formData;

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

  if (isLoggedIn) {
    return props.history.location.state ? (
      <Redirect to={props.history.location.state.from} />
    ) : (
      <Redirect to="/dashboard" />
    );
  }

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row center">
          <h1 className="center teal-text mt-4 mb-2">Login</h1>
          <p className="flow-text teal-text">
            <i className="fas fa-sign-in-alt mr-1 mb-1"></i>Sign into your
            account
          </p>
          <div className="col s6 offset-s3 card">
            <div className="card-content">
              <form onSubmit={onSubmit}>
                <div className="input-field">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={onChange}
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
                    onChange={onChange}
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
