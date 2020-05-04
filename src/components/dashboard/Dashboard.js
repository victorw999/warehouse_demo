import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import OrderList from "../orderview/OrderList/OrderList";
import StyleList from "../styleview/StyleList";
import StaffList from "../staffview/StaffList";
import { clearAllTasks } from "../../store/actions/taskActions";
import { createJob } from "../../store/actions/jobActions";
import { createNotification } from "../../store/actions/noteActions";
import { clearOrderStatus } from "../../store/actions/orderActions";
import Notifications from "./Notifications";
import Notification1 from "./Notification1";
import { isSuper } from "../utilityFunc/functions";

class Dashboard extends Component {
  handleCreateNotification = (content) => {
    this.props.createNotification(content);
  };

  handleCreateJob = (job, jobType, flag) => {
    this.props.createJob(job, jobType, flag);
  };

  clearOrderStatus = () => {
    this.props.clearOrderStatus();
  };
  clearAllTasks = () => {
    this.props.clearAllTasks();
  };

  render() {
    const { orders, auth, notifications, tasks, profile, showTab } = this.props;

    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="dashboard container ">
        {/*
         <div className="center">
           <h5 className="center">DEVELOPER TOOLS:</h5>
          <button className="btn grey" onClick={this.clearOrderStatus}>
            RESET ORDER STATUS
          </button>
          <button className="btn red" onClick={this.clearAllTasks}>
            CLEAR ALL TASKS
          </button> 
        </div>
        */}
        <div className="notification_bar teal lighten-4">
          <a className="btn teal btn-flat white-text" href="#notifications">
            Notifications
          </a>
          <Notification1 notifications={notifications} />
        </div>

        {/* Styles */}
        {showTab === "styles" ? (
          <div className="row">
            <div className="col s12 m12 l8">
              {/**********   
                  StyleList
                 **********/}
              <StyleList
                auth={auth}
                profile={profile}
                orders={orders}
                handleCreateNotification={this.handleCreateNotification}
                handleCreateJob={this.handleCreateJob}
              />
            </div>
            <div className="col s12 m12 l4 left-align">
              <Notifications notifications={notifications} />
            </div>
          </div>
        ) : (
          ""
        )}
        {/* END: Styles */}

        {/* Orders */}
        {showTab === "orders" ? (
          <div className="row">
            <div className="col s12 m12 l8">
              {/**********   
                  OrderList
                 **********/}
              <OrderList
                orders={orders}
                profile={profile}
                handleCreateJob={this.handleCreateJob}
              />
            </div>
            <div className="col s12 m12 l4 left-align ">
              <Notifications notifications={notifications} />
            </div>
          </div>
        ) : (
          ""
        )}
        {/* END: Orders */}

        {/* Staffs */}
        {showTab === "staffs" && isSuper(profile) ? (
          <div className="row">
            <div className="col s12 m12 l8">
              {/**********   
              StaffList
              **********/}
              <StaffList tasks={tasks} handleCreateJob={this.handleCreateJob} />
            </div>
            <div className="col s12 m12 l4 left-align ">
              <Notifications notifications={notifications} />
            </div>
          </div>
        ) : (
          ""
        )}
        {/* END: Staffs */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications,
    /**
     * "state.firestore.ordered.orders" caused duplication when add/edit new documents,
     * REF: https://github.com/prescottprue/redux-firestore/issues/254#issuecomment-560115309
     * solution: use "state.firestore.data.orders" instead of "state.firestore.ordered.orders"
     */
    orders: (() => {
      // convert the obj into array with doc id injected
      let odrObj = state.firestore.data.orders;

      /**
       * bugfix: After deleting a order in order_view, "odrObj" will still have that deleted order's key,
       * but its value will be "null".
       * so below map() will only return when the value isn't null
       * then use filter() eliminate "undefine" elements
       */
      let odrArr =
        odrObj &&
        Object.keys(odrObj)
          .map((key) => {
            if (odrObj[key]) {
              return {
                ...odrObj[key],
                id: key,
              };
            }
          })
          .filter((o) => o !== undefined);
      return odrArr;
    })(),
    tasks: state.firestore.ordered.tasks,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createNotification: (content) => dispatch(createNotification(content)),
    createJob: (job, jobType, flag) => dispatch(createJob(job, jobType, flag)),
    clearOrderStatus: () => dispatch(clearOrderStatus()),
    clearAllTasks: () => dispatch(clearAllTasks()),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "orders",
    },
    {
      collection: "notifications",
      limit: 5,
      orderBy: ["time", "desc"],
    },
    {
      collection: "tasks",
    },
  ])
)(Dashboard);
