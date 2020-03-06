/**
 *  @desc - init 'newTasks' obj(hashtable)
 *      props:  'task' collection
 *      group tasks by user id
 */
import React, { useState, useEffect } from "react";
import HashTable from "../utilityFunc/HashTable";
import M from "materialize-css";
import StaffFilteredList from "./StaffFilteredList";
import useDataApi2 from "../utilityFunc/fetchData/useDataApi2";
// HashTable: http://www.mojavelinux.com/articles/javascript_hashes.html

const StaffList = ({
  tasks,
  handleCompletePickTask,
  handleDeletePickTask,
  handleCreateJob,
  feedback
}) => {
  // useReducer: custom hook, load "tasks" into "data"
  const [{ data }, updateData] = useDataApi2(tasks);

  // group "incomplete tasks" base on user
  const [newTasks, setNewTasks] = useState({});
  // group "completed tasks" base on user
  const [doneTasks, setDoneTasks] = useState({});
  // num of items in newTasks
  const [numNewT, setNumNewT] = useState(0);
  // num of items in doneTasks
  const [numDoneT, setNumDoneT] = useState(0);

  /**
   *  init collapislbe for "newTasks"
   *  2nd param is for checking if the 'newTasks' has been loaded
   */
  useEffect(() => {
    if (numNewT > 0) {
      // grab collapsible elements by 'className'
      var elems = document.querySelectorAll(".collapsible_stafflist");
      var instances = M.Collapsible.init(elems, {
        accordion: false // begin with closed accordin
      });

      // loop thru each item & open()
      var items = document.querySelectorAll(
        ".collapsible_stafflist .collapsible-item"
      );
      for (var i = 0; i <= items.length; i++) {
        instances[0].open(i);
      }
    }
  }, [newTasks]);

  /**
   *  init collapislbe for "doneTasks"
   */
  useEffect(() => {
    if (numDoneT > 0) {
      // grab collapsible elements by 'className'
      var elems = document.querySelectorAll(".collapsible_stafflist");
      var instances = M.Collapsible.init(elems, {
        accordion: false
      });

      // loop thru each item & open()
      var items = document.querySelectorAll(
        ".collapsible_stafflist .collapsible-item"
      );
      for (var i = 0; i <= items.length; i++) {
        instances[0].open(i);
      }
    }
  }, [doneTasks]);

  /**
   * this useEffect() catagorize all tasks to 2 objs
   * init "newTasks", "doneTasks" w/ HashTable
   * "newTasks", "doneTasks" are both objects, with
   *    keys:  user's id
   *    value: an array of tasks this newTasks is assigned
   */
  useEffect(() => {
    // check if 'data' is ready && and if 'data' is not empty array
    if (data && Array.isArray(data)) {
      var new_tasks = new HashTable();
      var done_tasks = new HashTable();

      for (let task of data) {
        // determine task's "progress"  "done" / "new"
        var progress =
          task.status && task.status.includes("complete") ? "done" : "new";
        /**
         * if "progress" is "new", populating "new_tasks"
         */
        if (progress === "new") {
          if (!new_tasks.hasItem(task.ownerId)) {
            // if this task has not been added to "new_tasks"
            new_tasks.setItem(task.ownerId, [task]); // catogorize task to new_tasks
          } else {
            let new_arr = new_tasks.getItem(task.ownerId); // retireve task to obj
            console.log("new_arr: ", new_arr);
            let exist_in_new_arr = new_arr.some(a => a.id === task.id);
            if (!exist_in_new_arr) {
              new_tasks.setItem(task.ownerId, [...new_arr, task]);
            }
          } // end else
        } // END: if (progress === "new")

        /**
         * if "progress" is "done", populating "done_tasks"
         */
        if (progress === "done") {
          if (!done_tasks.hasItem(task.ownerId)) {
            // if this task has not been added to "done_tasks"
            done_tasks.setItem(task.ownerId, [task]); // catogorize task to done_tasks
          } else {
            // add task to "done_arr"
            let done_arr = done_tasks.getItem(task.ownerId);
            let exist_in_done_arr = done_arr.some(a => a.id === task.id);
            if (!exist_in_done_arr) {
              done_tasks.setItem(task.ownerId, [...done_arr, task]);
            }
          } // end else
        } // END: if (progress === "done")
      } // end for loop of tasks
      setNewTasks(new_tasks.items);
      setDoneTasks(done_tasks.items);
      setNumNewT(new_tasks.length);
      setNumDoneT(done_tasks.length); // this hashtable's length is no use?
    }
  }, [data]);

  /**
   * if detecting changes from upstream, update useDataApi
   */
  useEffect(() => {
    updateData(tasks);
  }, [tasks]);

  return (
    <>
      {/* 
        Completed Tasks       
      */}
      <h5>Processing</h5>
      <div className="stafflist section new_tasks_section">
        {newTasks ? (
          <StaffFilteredList
            users={newTasks}
            handleCreateJob={handleCreateJob}
            tasks={data} // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
          />
        ) : (
          <div>Staff List not initilized</div>
        )}
      </div>
      {/* 
        Completed Tasks    
      */}
      <h5>Completed</h5>
      <div className="stafflist section done_tasks_section">
        {newTasks ? (
          <StaffFilteredList
            users={doneTasks}
            handleCreateJob={handleCreateJob}
            tasks={data} // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
          />
        ) : (
          <div>Staff List not initilized</div>
        )}
      </div>
    </>
  );
};

export default StaffList;
