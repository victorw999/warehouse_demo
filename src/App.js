import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

// Order View
import CreateOrder from "./components/orderview/CreateOrder/CreateOrder";
import OrderDetails from "./components/orderview/OrderDetails/OrderDetails";
import OrderNADetails from "./components/orderview/OrderNADetails/OrderNADetails";

import "materialize-css/dist/css/materialize.min.css";

import TimeReport from "./components/report/TimeReport";
import ImportOrders from "./components/import/ImportOrders";
import Users from "./components/users/Users";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: "orders" }; //keep track of the "active tab"
    this.updateTab = this.updateTab.bind(this);
  }

  updateTab = (changeTo) => {
    this.setState({ tab: changeTo });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar showTab={this.state.tab} updateTab={this.updateTab} />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Dashboard showTab={this.state.tab} {...props} />
              )}
            />
            <Route
              path="/signin"
              render={(props) => (
                <SignIn updateTab={this.updateTab} {...props} />
              )}
            />
            <Route path="/signup" component={SignUp} />
            <Route path="/createorder" component={CreateOrder} />
            <Route path="/order/:id" component={OrderDetails} />
            <Route path="/orderna/:id" component={OrderNADetails} />
            <Route path="/importorders" component={ImportOrders} />
            <Route path="/timereport" component={TimeReport} />
            <Route path="/users" component={Users} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
