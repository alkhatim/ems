import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { register } from "../../actions/authActions";
import messages from "../../helpers/messages";

export const Register = () => {
  const [formData, setformData] = useState({
    username: "",
    password: "",
    password2: "",
    isAdmin: false
  });

  const { username, password, password2, isAdmin } = formData;

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(register(username, password, isAdmin));
    messages.success("User registered");
  };

  if (isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row center">
          <h1 className="center teal-text mt-4 mb-2">Sign Up</h1>
          <p className="flow-text teal-text">
            <i className="fas fa-sign-in-alt mr-1 mb-1"></i> Register an account
            for a new user
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
                <div className="input-field">
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    value={password2}
                    onChange={onChange}
                    className="validate"
                    required
                  />
                  <label htmlFor="password2">Confirm Password</label>
                </div>
                <div className="file-field input-field">
                  <div className="btn yellow darken-2">
                    <span>Upload</span>
                    <input type="file" />
                  </div>
                  <div className="file-path-wrapper">
                    <input
                      className="file-path"
                      type="text"
                      placeholder="Profile Picture"
                    />
                  </div>
                </div>
                <div className="input-field my-2">
                  <p>
                    <label>
                      <input
                        type="checkbox"
                        name="isAdmin"
                        id="isAdmin"
                        onChange={onChange}
                        class="filled-in"
                      />
                      <span>Admin Account</span>
                    </label>
                  </p>
                </div>

                <div className="input-field">
                  <button type="submit" className="btn btn-large">
                    Register
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
