import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Joi from "joi";
import { login } from "../../actions/authActions";

export const Login = props => {
  const [formData, setformData] = useState({
    username: "",
    password: "",
    errors: {
      username: "",
      password: ""
    }
  });

  const { username, password, errors } = formData;

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

  const onBlur = e => {
    validateProperty(e.target);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (validateForm()) return;
    dispatch(login(username, password));
  };

  const formSchema = {
    username: Joi.string()
      .min(4)
      .max(30)
      .required()
      .label("Username"),
    password: Joi.string()
      .min(6)
      .max(26)
      .required()
      .label("Password")
  };

  const validateForm = () => {
    const { error } = Joi.validate({ username, password }, formSchema, {
      abortEarly: false
    });
    if (error) {
      const errors = {};
      for (let item of error.details) {
        errors[item.path[0]] = item.message;
      }
      setformData({ ...formData, errors });
      return error;
    }
  };

  const validateProperty = input => {
    const { error } = Joi.validate(
      { [input.name]: input.value },
      { [input.name]: formSchema[input.name] }
    );
    if (error) {
      errors[input.name] = error.details[0].message;
      setformData({ ...formData, errors });
    } else {
      delete errors[input.name];
      setformData({ ...formData, errors });
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row center">
          <h4 className="center teal-text auth-page-header">Login</h4>
          <div className="col s6 offset-s3 card">
            <div className="card-content">
              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="input-field">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={errors.username ? "invalid" : ""}
                    />
                    <label htmlFor="username">Usernmae</label>
                    <span className="helper-text red-text left">
                      {errors.username}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={errors.password ? "invalid" : ""}
                    />
                    <label htmlFor="password">Password</label>
                    <span className="helper-text red-text left">
                      {errors.password}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field center">
                    <button type="submit" className="btn btn-large">
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
