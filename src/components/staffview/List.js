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
  tasks, // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
}) => {
  const isEmpty = (obj) => {
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
  const statusColor = (status) => {
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
        ? Object.keys(usersFiltered).map((key) => {
            /**
             *  this user's tasks
             */
            const user_tasks = usersFiltered[key].map((t) => {
              return (
                <div className="staff_task row card-panel" key={t.key + t.id}>
                  {/* can't use getTimestamp() as key, it'll generate duplicate
                      task row. Need to combine "t.key + t.id" as key, otherwise
                      it'll have a error: "no unique key"
                  */}

                  <div className="col s12 m5 order_desc">
                    {t.buyer}
                    <br />
                    {t.oid}
                  </div>
                  <div className="col s12 m4 item_desc">
                    <div className="item_desc_row">
                      <span className="task_owner">{t.owner}</span>
                      <span
                        className={
                          "status_badge white-text " + statusColor(t.status)
                        }
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="item_desc_row">
                      <span className="sku">{t.sku}</span>
                      <span className="qty">
                        {t.quantity ? (
                          <span className="item_qty">{t.quantity}</span>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="col s12 m3 actions_section">
                    <ListBtns
                      task={t}
                      handleCreateJob={handleCreateJob}
                      tasks={tasks} // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
                    />
                  </div>
                </div>
              );
            });

            /**
             *  USER HEADER
             */
            const user_header = (() => {
              // get 1st item from user's array, assuming usersFiltered[key] size is >0
              const userName = usersFiltered[key][0].owner;

              return (
                <li className="collapsible-item user_list_item" key={key}>
                  <div className="collapsible-header staff_header teal lighten-2 white-text row valign-wrapper">
                    <span className="col s12 m2">
                      <h4 className="name">{userName}</h4>
                    </span>
                    <span className="col s12 m1">
                      <span className="numOfTasks btn-floating btn-flat white teal-text ">
                        {usersFiltered[key].length}
                      </span>
                    </span>
                    <span className="col s12 m9"></span>
                  </div>
                  {/* collapsible body */}
                  <div className="collapsible-body">
                    <div className="user_tasks_collap_body">
                      <div>{user_tasks}</div>
                    </div>
                  </div>
                </li>
              );
            })();
            return <React.Fragment key={key}>{user_header}</React.Fragment>;
          })
        : "No Tasks"}
    </ul>
  );
};
export default List;
