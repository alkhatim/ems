import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Joi from "joi";
import { login } from "../../actions/authActions";
import FormInput from "../controls/FormInput";
import Submit from "../controls/Submit";

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

  const onSubmit = e => {
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
                <FormInput
                  type="text"
                  name="username"
                  label="Username"
                  error={errors.username}
                  value={username}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                <FormInput
                  type="password"
                  name="password"
                  label="Password"
                  error={errors.password}
                  value={password}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                <Submit label="Login" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
