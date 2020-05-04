import React from "react";
import StyleListDone from "./StyleListDone";
const StyleListDoneCollap = ({ styleGroup }) => {
  return (
    <>
      <ul className="collapsible collapsible_doneStyles">
        <li className="collapsible-item">
          {/* collapsible HEADER */}
          <div className="collapsible-header doneStyles_header grey white-text    row  ">
            <span className="name col s12 m3">
              {/* <i className={"material-icons"}> arrow_drop_down_circle </i> */}
              <span className="sku_qty btn-floating btn-flat white teal-text">
                {!styleGroup[0]
                  ? "undefined"
                  : styleGroup[0].styleno === ""
                  ? 0
                  : styleGroup.length}
              </span>
            </span>
            <span className="name col s12 m9"></span>
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
