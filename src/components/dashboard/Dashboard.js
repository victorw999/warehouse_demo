import React, { Component } from "react";
import OrderList from "../orders/OrderList/OrderList";
import StyleList from "../orders/StyleList/StyleList";
import StaffList from "../staffs/StaffList";
import {
  createPickTask,
  deletePickTask,
  completePickTask,
  updatePickTask,
  deleteMultiPickTasks
} from "../../store/actions/taskActions";
import { createJob } from "../../store/actions/jobActions";
import { createNotification } from "../../store/actions/noteActions";
import Notifications from "./Notifications";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Tabs, Tab } from "react-materialize";

class Dashboard extends Component {
  handleCreatePickTask = task => {
    this.props.createPickTask(task); // call dispatch method from mapDispatchToProps @ line 104
  };
  handleDeletePickTask = task => {
    this.props.deletePickTask(task);
  };
  deleteMultiPickTasks = list => {
    this.props.deleteMultiPickTasks(list);
  };

  handleCompletePickTask = task => {
    this.props.completePickTask(task);
  };

  handleUpdatePickTask = (task, newStatus) => {
    this.props.updatePickTask(task, newStatus);
  };

  handleCreateNotification = content => {
    this.props.createNotification(content);
  };

  handleCreateJob = (job, jobType, flag) => {
    this.props.createJob(job, jobType, flag);
  };

  render() {
    const { orders, auth, notifications, picktasks, profile } = this.props;

    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="dashboard container">
        {/* Selection Tabs */}
        <Tabs className="selection_tabs z-depth-1   ">
          <Tab
            options={{
              duration: 300,
              onShow: null,
              responsiveThreshold: Infinity,
              swipeable: false
            }}
            title="Styles"
          >
            <div className="row">
              <div className="col s12 m12 l8">
                {/**********   
                  StyleList
                 **********/}
                <StyleList
                  orders={orders}
                  handleCreatePickTask={this.handleCreatePickTask}
                  handleDeletePickTask={this.handleDeletePickTask}
                  handleCompletePickTask={this.handleCompletePickTask}
                  handleUpdatePickTask={this.handleUpdatePickTask}
                  handleCreateNotification={this.handleCreateNotification}
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
            <div className="row">
              <div className="col s12 m12 l8">
                {/**********   
                  OrderList
                 **********/}
                <OrderList
                  orders={orders}
                  currentUser={profile.firstName}
                  handleCreatePickTask={this.handleCreatePickTask}
                  handleDeletePickTask={this.handleDeletePickTask}
                  deleteMultiPickTasks={this.deleteMultiPickTasks}
                  handleCreateJob={this.handleCreateJob}
                />
              </div>
              <div className="col s12 m12 l4 left-align ">
                {/* <Notifications notifications={notifications} /> */}
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
            <div className="row">
              <div className="col s12 m12 l8">
                {/**********   
              StaffList
              **********/}
                <StaffList
                  picktasks={picktasks}
                  handleCompletePickTask={this.handleCompletePickTask}
                  handleDeletePickTask={this.handleDeletePickTask}
                />
              </div>
              <div className="col s12 m12 l4 left-align ">
                <Notifications notifications={notifications} />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // projects: state.firestore.ordered.projects,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications,
    // orders: state.firestore.ordered.orders, // this line cause duplication
    /**
     * "state.firestore.ordered.orders" caused duplication when i add/edit new documents,
     * REF: https://github.com/prescottprue/redux-firestore/issues/254#issuecomment-560115309
     * solution: use "state.firestore.data.orders" instead of "state.firestore.ordered.orders"
     */
    orders: (() => {
      // convert the object into array with doc id injected
      let odrObj = state.firestore.data.orders;
      let odrArr =
        odrObj &&
        Object.keys(odrObj).map(key => {
          return {
            ...odrObj[key],
            id: key
          };
        });
      return odrArr;
    })(),
    picktasks: state.firestore.ordered.picktasks,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPickTask: task => dispatch(createPickTask(task)),
    deletePickTask: task => dispatch(deletePickTask(task)),
    deleteMultiPickTasks: list => dispatch(deleteMultiPickTasks(list)),
    completePickTask: task => dispatch(completePickTask(task)),
    updatePickTask: (task, newStatus) =>
      dispatch(updatePickTask(task, newStatus)),
    createNotification: content => dispatch(createNotification(content)),
    createJob: (job, jobType, flag) => dispatch(createJob(job, jobType, flag))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "orders",
      orderBy: ["orderDate", "desc"]
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
