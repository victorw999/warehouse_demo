import React, { Component } from "react";
import ProjectListByTime from "../projects/ProjectListByTime";
import ProjectListByAuthor from "../projects/ProjectListByAuthor";
// import ToggleByAuthor from "../layout/ToggleByAuthor";
import ToggleListStyle from "../layout/ToggleListStyle";
import OrderList from "../orders/OrderList";
import StyleList from "../orders/StyleList";
import {
  createPickTask,
  deletePickTask,
  completePickTask,
  failPickTask
} from "../../store/actions/taskActions";

import Notifications from "./Notifications";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Tabs, Tab } from "react-materialize";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleListStyle: false
    };
  }

  handleToggleListStyle = () => {
    this.setState({
      toggleListStyle: !this.state.toggleListStyle
    });
  };

  handleCreatePickTask = task => {
    this.props.createPickTask(task); // call dispatch method from mapDispatchToProps @ line 104
  };
  handleDeletePickTask = task => {
    this.props.deletePickTask(task);
  };
  handleCompletePickTask = task => {
    this.props.completePickTask(task);
  };
  handleFailPickTask = task => {
    this.props.failPickTask(task);
  };

  // handleNoInventory = content => {
  //   this.props.notifyNoInventory(content);
  // };

  render() {
    const { orders, auth, notifications, picktasks } = this.props;

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

        <div
          className="row center valign-wrapper"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <ToggleListStyle
            handleToggle={this.handleToggleListStyle}
            style={{ margin: "auto" }}
          />
          {/* {this.state.toggleListStyle ? (
            <button className="btn-floating teal">teal</button>
          ) : (
            <button className="btn-floating red">red</button>
          )} */}
        </div>

        <Tabs className="tab-demo z-depth-1">
          <Tab
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Styles"
          >
            View By Styles
            <div className="row">
              <div className="col s12 m12 l8">
                <StyleList
                  orders={orders}
                  picktasks={picktasks}
                  handleCreatePickTask={this.handleCreatePickTask}
                  handleDeletePickTask={this.handleDeletePickTask}
                  handleCompletePickTask={this.handleCompletePickTask}
                  handleFailPickTask={this.handleFailPickTask}
                  // handleNoInventory={this.handleNoInventory}
                />
              </div>
              <div className="col s12 m12 l4 left-align ">
                <Notifications notifications={notifications} />
              </div>
            </div>
          </Tab>
          <Tab
            active
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Orders"
          >
            View By Orders
            <div className="row">
              <div className="col s12 m12 l8">
                <OrderList orders={orders} />
              </div>
              <div className="col s12 m12 l4 left-align ">
                <Notifications notifications={notifications} />
              </div>
            </div>
          </Tab>
          <Tab
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Staffs"
          >
            View By Staffs
          </Tab>
        </Tabs>

        <div className="row center">
          {this.state.toggleListStyle ? (
            <OrderList orders={orders} />
          ) : (
            <div className="row">
              <div className="col s12 m12 l8">
                <StyleList
                  orders={orders}
                  picktasks={picktasks}
                  handleCreatePickTask={this.handleCreatePickTask}
                  handleDeletePickTask={this.handleDeletePickTask}
                  handleCompletePickTask={this.handleCompletePickTask}
                  handleFailPickTask={this.handleFailPickTask}
                  // handleNoInventory={this.handleNoInventory}
                />
              </div>
              <div className="col s12 m12 l4 left-align ">
                <Notifications notifications={notifications} />
              </div>
            </div>
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
    orders: state.firestore.ordered.orders,
    picktasks: state.firestore.ordered.picktasks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPickTask: task => dispatch(createPickTask(task)),
    deletePickTask: task => dispatch(deletePickTask(task)),
    completePickTask: task => dispatch(completePickTask(task)),
    failPickTask: task => dispatch(failPickTask(task))
    // notifyNoInventory: () => {
    //   console.log("NO INVENTORY !!!!");
    // }
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "orders"
      // orderBy: ["itemlist", "desc"]
    },
    {
      collection: "notifications",
      limit: 5,
      orderBy: ["time", "desc"]
    },
    {
      collection: "picktasks"
    }
  ])
)(Dashboard);
