import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = props => {
  const { path, component: Component, render, ...rest } = props;
  const isLoggedIn = useSelector(state => state.authReducer.isLoggedIn);

  return (
    <Route
      {...rest}
      render={props => {
        if (!isLoggedIn)
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
