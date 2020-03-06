import React from "react";
import StyleListDone from "./StyleListDone";
const StyleListDoneCollap = ({ styleGroup }) => {
  return (
    <>
      <ul className="collapsible collapsible_doneStyles">
        <li className="collapsible-item">
          {/* collapsible HEADER */}
          <div className="collapsible-header doneStyles_header grey white-text">
            <h4 className="name">
              <i className={"material-icons"}> arrow_drop_down_circle </i>
            </h4>
          </div>
          {/* collapsible BODY */}
          <div className="collapsible-body">
            <StyleListDone styleGroup={styleGroup} />
          </div>
        </li>
      </ul>
    </>
  );
};

export default StyleListDoneCollap;
