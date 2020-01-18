import React, { Fragment } from "react";
import { Navbar } from "./components/layouts/Navbar";
import { Landing } from "./components/layouts/Landing";
import { Footer } from "./components/layouts/Footer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import "./spacing.css";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Switch>
      <Route exact path="/" component={Landing} />
    </Switch>
    <Footer />
  </BrowserRouter>
);

export default App;
