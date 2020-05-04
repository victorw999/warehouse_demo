/**
 * @desc - filtering logic for Staff View
 *
 *  - get string from <input>,
 *  - Filters the 'users' obj (from props) based on <input>
 *  - Produce a "usersFiltered" obj
 *
 */

import React, { useState, useEffect } from "react";
import List from "./List";

export default function StaffFilteredList({
  users,
  handleCreateJob,
  tasks // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
}) {
  // 'usersFiltered' is generated after filtering props.users based on input
  const [usersFiltered, setUsersFiltered] = useState({});

  useEffect(() => {
    setUsersFiltered(users);
  }, [users]);

  const filterList = event => {
    try {
      if (event.target.value === "") {
        setUsersFiltered(users); // if input is empty, reset users
      } else {
        const filtered = Object.keys(usersFiltered)
          .filter(key => {
            // get the keys that match input
            let name = usersFiltered[key][0].owner;
            return (
              name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
            );
          })
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: usersFiltered[key]
            };
          }, {});
        setUsersFiltered(filtered);
      }
    } catch (e) {
      console.log("error: ", e);
    }
  };

  return (
    <div className="filter-list">
      <input type="text" placeholder="Search" onChange={filterList} />
      <List
        usersFiltered={usersFiltered}
        handleCreateJob={handleCreateJob}
        tasks={tasks} // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
      />
    </div>
  );
}
