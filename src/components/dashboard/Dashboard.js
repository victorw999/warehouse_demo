import React, { Component } from "react";
import ProjectListByTime from "../projects/ProjectListByTime";
import ProjectListByAuthor from "../projects/ProjectListByAuthor";
// import ToggleByAuthor from "../layout/ToggleByAuthor";
import Toggle2 from "../layout/Toggle2";
import OrderList from "../orders/OrderList";
import StyleList from "../orders/StyleList";

import Notifications from "./Notifications";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isProjectListByAuthor: false,
      toggle2: true
    };
  }

  // handleToggleSortByAuthor = () => {
  //   this.setState({
  //     isProjectListByAuthor: !this.state.isProjectListByAuthor
  //   });
  // };

  handleToggle2 = () => {
    this.setState({
      toggle2: !this.state.toggle2
    });
  };

  render() {
    const { orders, auth, notifications } = this.props;

    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="dashboard container">
        {/* <div className="row center">
          <ToggleByAuthor handleToggle={this.handleToggleSortByAuthor} />
          {this.state.isProjectListByAuthor ? (
            <button className="btn-floating teal">teal</button>
          ) : (
            <button className="btn-floating red">red</button>
          )}
        </div> */}

        <div className="row center">
          <Toggle2 handleToggle={this.handleToggle2} />
          {this.state.toggle2 ? (
            <button className="btn-floating teal">teal</button>
          ) : (
            <button className="btn-floating red">red</button>
          )}
        </div>

        <div className="row center">
          {this.state.toggle2 ? (
            <OrderList orders={orders} />
          ) : (
            <StyleList orders={orders} />
          )}
        </div>

        <div className="row">
          <div className="col s12 m6">
            {this.state.isProjectListByAuthor ? (
              // since i'm connecting w/ firestoreConnect in child compoenet,
              // i don't need to pass down the props here
              // <ProjectListByAuthor projects={projects} />
              <ProjectListByAuthor />
            ) : (
              // <ProjectListByTime projects={projects} />
              <ProjectListByTime />
            )}
          </div>
          <div className="col s12 m5 offset-m1">
            <Notifications notifications={notifications} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.firestore.ordered.projects,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications,
    // ordersOld: state.order.orders, // demo data frm 'reducers/orderReducer.js'
    orders: state.firestore.ordered.orders
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "orders"
      // orderBy: ["itemlist", "desc"]
    },
    {
      collection: "notifications",
      limit: 5,
      orderBy: ["time", "desc"]
    }
  ])
)(Dashboard);
