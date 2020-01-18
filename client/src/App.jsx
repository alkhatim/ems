import React from "react";
import { Navbar } from "./components/layouts/Navbar";
import { Landing } from "./components/layouts/Landing";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import "./spacing.css";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
    </Switch>
  </BrowserRouter>
);

export default App;
