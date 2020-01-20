import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import http from "./helpers/http";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navbar } from "./components/layouts/Navbar";
import { Landing } from "./components/layouts/Landing";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";
import "./spacing.css";

const App = () => {
  useEffect(() => {
    store.dispatch(http.loadUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </BrowserRouter>
      <ToastContainer pauseOnFocusLoss={false} />
    </Provider>
  );
};

export default App;
