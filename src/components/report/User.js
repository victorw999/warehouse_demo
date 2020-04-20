/**
 * display each user's info in a row
 */
import React from "react";

const User = ({ tasks }) => {
  return (
    <>
      {tasks.map((task) => {
        return (
          <React.Fragment>
            <tr className="task_row">
              {task.map((t) => {
                return <td>{t}</td>;
              })}
            </tr>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default User;
