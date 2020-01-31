import React, { useState, useEffect, useRef } from "react";
import HashTable from "../utilityFunc/HashTable";
import M from "materialize-css";
import StaffFilteredList from "./StaffFilteredList";

// HashTable: http://www.mojavelinux.com/articles/javascript_hashes.html

const StaffList = props => {
  const picktasks = props.picktasks;

  // group tasks base on user
  const [users, setUsers] = useState({});
  const [numOfUsers, setNumOfUsers] = useState(0);

  // init collapible, 2nd param is for checking if the 'users' has been loaded
  useEffect(() => {
    if (numOfUsers > 0) {
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
  }, [users]);

  // init users HashTable
  useEffect(() => {
    if (picktasks) {
      var hash = new HashTable();
      for (let task of picktasks) {
        if (!hash.hasItem(task.authorId)) {
          hash.setItem(task.authorId, [task]);
        } else {
          let arr = hash.getItem(task.authorId);
          let exist = false; // check if task exist in array
          for (let a of arr) {
            if (a.id === task.id) {
              console.error(`picktask ${task.id} duplicates! `);
              exist = true;
              break;
            }
          }
          if (!exist) {
            hash.setItem(task.authorId, [...arr, task]);
          }
        }
      } // end for loop of picktasks

      setUsers(hash.items);
      setNumOfUsers(hash.length); // this hashtable's length is no use?
    }
  }, [picktasks]);

  return (
    <div className="stafflist section">
      {users ? (
        <StaffFilteredList
          users={users}
          handleCompletePickTask={props.handleCompletePickTask}
          handleDeletePickTask={props.handleDeletePickTask}
        />
      ) : (
        <div>NOTHING</div>
      )}
    </div>
  );
}; //StaffList func

export default StaffList;
