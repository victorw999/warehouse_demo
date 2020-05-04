/**
 *  @desc - display time spent on each task, sort by employees
 */
import React, { useState, useEffect } from "react";
import HashTable from "../utilityFunc/HashTable";
import useDataApi from "../utilityFunc/fetchData/useDataApi";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import TimeReportTable from "./TimeReportTable";
import { Redirect } from "react-router-dom";

const TimeReport = ({ tasks, handleCreateJob, auth }) => {
  // useReducer: custom hook, load "tasks" into "data"
  const [{ data }, updateData] = useDataApi(tasks);

  // group "completed tasks" base on user
  const [allTasks, setAllTasks] = useState({});
  /**
   * this useEffect() catagorize tasks into an obj
   * init "allTasks" w/ HashTable
   * "allTasks", is object, with
   *    keys:  user's id
   *    value: an array of tasks this newTasks is assigned
   */
  useEffect(() => {
    // check if 'data' is ready && and if 'data' is not empty array
    if (data && Array.isArray(data)) {
      var all_tasks = new HashTable(); // includ all new/done tasks

      for (let task of data) {
        if (!all_tasks.hasItem(task.ownerId)) {
          // if this task has not been added to "all_tasks"
          all_tasks.setItem(task.ownerId, [task]); // catogorize task to all_tasks
        } else {
          let new_arr = all_tasks.getItem(task.ownerId); // retireve task to obj

          let exist_in_new_arr = new_arr.some((a) => a.id === task.id);
          if (!exist_in_new_arr) {
            all_tasks.setItem(task.ownerId, [...new_arr, task]);
          }
        } // end else
      } // end for loop of tasks
      setAllTasks(all_tasks.items);
    }
  }, [data]);

  /**
   * if detecting changes from upstream, update useDataApi
   */
  useEffect(() => {
    updateData(tasks);
  }, [tasks]);

  if (!auth.uid) return <Redirect to="/signin" />;
  return (
    <div className="timereport white container">
      {allTasks ? (
        <TimeReportTable allTasks={allTasks} />
      ) : (
        <div>Not initilized</div>
      )}
    </div> // END: .timereport
  );
};

const mapStateToProps = (state) => {
  return {
    tasks: state.firestore.ordered.tasks,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps, null),
  firestoreConnect([
    {
      collection: "tasks",
    },
  ])
)(TimeReport);
