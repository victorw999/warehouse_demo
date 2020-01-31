import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import ProjectDetails from "./components/projects/ProjectDetails";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import TestApp from "./components/test/TestApp";
import CreateOrder from "./components/orders/CreateOrder/CreateOrder";
// import OrderDetails from "./components/orders/OrderDetails";
import OrderDetails from "./components/orders/OrderDetails/OrderDetails";
import LoadWithHooks from "./components/test/LoadWithHooks";
import LoadWithHooks2 from "./components/test/LoadWithHooks2";
import "materialize-css/dist/css/materialize.min.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/project/:id" component={ProjectDetails} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/create" component={CreateProject} />
            <Route path="/test" component={TestApp} />
            <Route path="/createorder" component={CreateOrder} />
            <Route path="/order/:id" component={OrderDetails} />

            <Route path="/loadwithhooks" component={LoadWithHooks} />
            <Route path="/loadwithhooks2" component={LoadWithHooks2} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
