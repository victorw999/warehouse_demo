import React, { useState, useEffect } from "react";
import List from "./List";

export default function StaffFilteredList(props) {
  const [users, setUsers] = useState({});

  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  const filterList = event => {
    try {
      if (event.target.value === "") {
        setUsers(props.users); // if input is empty, reset users
      } else {
        const filtered = Object.keys(users)
          .filter(key => {
            // get the keys that match input
            let name = users[key][0].authorFirstName;
            return (
              name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
            );
          })
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: users[key]
            };
          }, {});
        setUsers(filtered);
      }
    } catch (e) {
      console.log("error: ", e);
    }
  };

  return (
    <div className="filter-list">
      <input type="text" placeholder="Search" onChange={filterList} />
      <List
        users={users}
        handleCompletePickTask={props.handleCompletePickTask}
        handleDeletePickTask={props.handleDeletePickTask}
      />
    </div>
  );
}
