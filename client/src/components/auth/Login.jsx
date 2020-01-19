import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = () => {
  const [formData, setformData] = useState({
    username: "",
    password: ""
  });

  const { username, password } = formData;

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      toast.success("Done", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000
      });
    } catch (error) {
      toast.error("Failed!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000
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
                    id="name"
                    value={username}
                    onChange={e => onChange(e)}
                    className="validtae"
                  />
                  <label for="username">Usernmae</label>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={e => onChange(e)}
                    className="validtae"
                  />
                  <label for="password">Password</label>
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
