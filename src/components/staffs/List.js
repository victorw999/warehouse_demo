/**
 * @desc - renders collaspible Header & Body depends on 'usersFiltered' prop
 *
 *  "usersFiltered" - an obj constains key-value pairs, in which the key is user id, value is the tasks of the user
 *
 *  loop thru "usersFiltered",
 *    user_header() renders collapsible header
 *    user_tasks()  renders collapsible body
 */

import React from "react";
import ListBtns from "./ListBtns";

const List = ({
  usersFiltered,
  handleCreateJob,
  tasks // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
}) => {
  const isEmpty = obj => {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if (obj === undefined) return true;
    if (obj === null) return true;
    if (obj.length === 0) return true;

    if (typeof obj != "object") return true;

    if (obj.length > 0) return false;

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  };
  /**
   *
   * @desc - depend on task's status change the look
   * @param {string} status - task's status
   * @returns - className
   */
  const statusColor = status => {
    if (status === "picking") {
      return "blue";
    } else if (status === "pick_complete") {
      return " teal lighten-1";
    } else if (status === "n/a") {
      return " orange lighten-1";
    } else {
      return " black";
    }
  };
  return (
    <ul className="collapsible collapsible_stafflist">
      {!isEmpty(usersFiltered)
        ? Object.keys(usersFiltered).map(key => {
            /**
             *  this user's tasks
             */
            const user_tasks = usersFiltered[key].map(t => {
              return (
                <tr className="staff_task" key={t.key}>
                  <td>
                    {t.owner} <br />
                    <span
                      className={"badge white-text " + statusColor(t.status)}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.buyer}
                    <br />
                    {t.oid}
                  </td>
                  <td>{t.sku}</td>
                  <td>[{t.quantity}]</td>
                  <td className="actions_section">
                    <ListBtns
                      task={t}
                      handleCreateJob={handleCreateJob}
                      tasks={tasks} // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
                    />
                  </td>
                </tr>
              );
            });

            /**
             *  USER HEADER
             */
            const user_header = (() => {
              // get 1st item from user's array, assuming usersFiltered[key] size is >0
              const userName = usersFiltered[key][0].owner;
              return (
                <li className="collapsible-item" key={key}>
                  <div className="collapsible-header staff_header teal lighten-2 white-text">
                    <h4 className="name">{userName}</h4>
                  </div>
                  {/* collapsible body */}
                  <div className="collapsible-body">
                    <table className="responsive-table">
                      <tbody>{user_tasks}</tbody>
                    </table>
                  </div>
                </li>
              );
            })();

            return <>{user_header}</>;
          })
        : "No Tasks"}
    </ul>
  );
};
export default List;
