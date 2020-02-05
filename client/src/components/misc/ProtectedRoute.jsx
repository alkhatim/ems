import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = props => {
  const { path, component: Component, ...rest } = props;
  const isLoggedIn = useSelector(store => store.authReducer.isLoggedIn);
  const isLoading = useSelector(store => store.authReducer.isLoading);

  return (
    <Route
      {...rest}
      render={props =>
        !isLoading && !isLoggedIn ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default ProtectedRoute;
