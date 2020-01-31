import React, { useState, useEffect, useRef } from "react";
import HashTable from "../utilityFunc/HashTable";
import M from "materialize-css";
// import M from "materialize-css/dist/js/materialize.min.js";
// HashTable: http://www.mojavelinux.com/articles/javascript_hashes.html

const StaffList = () => {
  useEffect(() => {
    // grab collapsible elements by 'className'
    var elems = document.querySelectorAll(".collapsible22");
    var instances = M.Collapsible.init(elems, {
      accordion: false
    });

    // loop thru each item & open()
    var items = document.querySelectorAll(".collapsible22 .collapsible-item");
    for (var i = 0; i < items.length; i++) {
      instances[0].open(i);
    }
  }, []);

  return (
    <div className="stafflist section">
      picktasks
      <ul className="collapsible collapsible22">
        <li className="collapsible-item">
          <div className="collapsible-header"> 1342 </div>
          <div className="collapsible-body">111</div>
        </li>

        <li className="collapsible-item">
          <div className="collapsible-header"> 220 </div>
          <div className="collapsible-body">222</div>
        </li>

        <li className="collapsible-item">
          <div className="collapsible-header"> 3972</div>
          <div className="collapsible-body">333</div>
        </li>
      </ul>
    </div>
  );
};

export default StaffList;
