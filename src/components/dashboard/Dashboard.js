import React, { Component } from "react";
import ProjectListByTime from "../projects/ProjectListByTime";
import ProjectListByAuthor from "../projects/ProjectListByAuthor";
import ToggleByAuthor from "../layout/ToggleByAuthor";
import OrderList from "../orders/OrderList";

import Notifications from "./Notifications";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProjectListByAuthor: false
    };
  }

  handleToggleSortByAuthor = () => {
    this.setState({
      isProjectListByAuthor: !this.state.isProjectListByAuthor
    });
  };

  render() {
    // console.log(this.state);
    console.log(this.props);

    const { orders, projects, auth, notifications } = this.props;

    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="dashboard container">
        <div className="row center">
          <ToggleByAuthor handleToggle={this.handleToggleSortByAuthor} />
          {this.state.isProjectListByAuthor ? (
            <button className="btn-floating teal">teal</button>
          ) : (
            <button className="btn-floating red">red</button>
          )}
        </div>

        <div className="row center">
          <OrderList orders={orders} />
        </div>

        <div className="row">
          <div className="col s12 m6">
            {this.state.isProjectListByAuthor ? (
              // since i'm connecting w/ firestoreConnect in child compoenet, i don't need to pass down the props here
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
    orders: state.order.orders
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    // {
    //   collection: "projects",
    //   orderBy: ["createdAt", "desc"]
    // },
    {
      collection: "notifications",
      limit: 5,
      orderBy: ["time", "desc"]
    }
  ])
)(Dashboard);
