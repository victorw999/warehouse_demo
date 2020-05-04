/**
 * @desc - display 1st note
 *
 */

import React from "react";
import moment from "moment";

const Notification1 = (props) => {
  const { notifications } = props;
  var item = notifications ? notifications[0] : null;
  return (
    <span className="notification1 online-users notifications">
      {item ? (
        <>
          <span className="">{item.user} </span>
          <span>{item.content}</span>
          <span className="note-date">
            {moment(item.time.toDate()).fromNow()}
          </span>
        </>
      ) : (
        ""
      )}
    </span>
  );
};

export default Notification1;
