import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import Joi from "joi";
import { register } from "../../actions/authActions";
import messages from "../../helpers/messages";
import defaultPic from "../../img/defaultProfile.png";

export const Register = () => {
  const [formData, setformData] = useState({
    username: "",
    password: "",
    password2: "",
    avatar: "",
    isAdmin: false,
    errors: {
      username: "",
      password: "",
      password2: ""
    }
  });

  const { username, password, password2, avatar, isAdmin, errors } = formData;

  let avatarInput = {};

  const dispatch = useDispatch();

  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheck = e => {
    setformData({
      ...formData,
      [e.target.name]: e.target.checked ? true : false
    });
  };

  const onUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    try {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setformData({ ...formData, avatar: reader.result });
      };
    } catch (error) {
      messages.error(error);
    }
  };

  const onBlur = e => {
    validateProperty(e.target);
  };

  const onSubmit = e => {
    e.preventDefault();
    if (validateForm()) return;
    dispatch(register(username, password, avatar, isAdmin));
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
      .label("Password"),
    password2: Joi.string()
      .valid(password)
      .error(() => {
        return {
          message: "Passwords don't match"
        };
      })
  };

  const validateForm = () => {
    const { error } = Joi.validate(
      { username, password, password2 },
      formSchema,
      {
        abortEarly: false
      }
    );
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
          <h4 className="center teal-text auth-page-header">Register</h4>
          <div className="col s6 offset-s3 card">
            <div className="card-content">
              <form onSubmit={onSubmit}>
                <div className="row">
                  <div className="file-field input-field">
                    <input
                      type="file"
                      onChange={onUpload}
                      ref={input => (avatarInput = input)}
                      className="hide"
                    />
                    <img
                      src={avatar || defaultPic}
                      alt="Profile Avatar"
                      onClick={() => avatarInput.click()}
                      className="circle responsive-img"
                      style={{
                        width: "70px",
                        height: "70px",
                        cursor: "pointer"
                      }}
                    />
                  </div>
                </div>
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
                  <div className="input-field">
                    <input
                      type="password"
                      name="password2"
                      id="password2"
                      value={password2}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={errors.password2 ? "invalid" : ""}
                    />
                    <label htmlFor="password2">Confirm Password</label>
                    <span className="helper-text red-text left">
                      {errors.password2}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field center"></div>
                </div>
                <div className="input-field mb-2">
                  <p>
                    <label>
                      <input
                        type="checkbox"
                        name="isAdmin"
                        id="isAdmin"
                        onChange={onCheck}
                        className="filled-in"
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
