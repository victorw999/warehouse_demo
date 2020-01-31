import React, { Component } from "react";

import M from "materialize-css";

/**
 *
 * when using class implemenation,
 * accordinion still not working
 *
 * SOLUTION:
 * each component's collapsible has to be unique
 */
class StaffList_class extends Component {
  componentDidMount() {
    let options = {
      accordion: false
    };
    var elems = document.querySelectorAll(".collapsible33");
    var instances = M.Collapsible.init(elems, options);
    var items = document.querySelectorAll(".collapsible33 .collapsible-item");
    for (var i = 0; i < items.length; i++) {
      instances[0].open(i);
    }
    console.log(instances[0]);
  }
  render() {
    return (
      <div className="stafflist section">
        picktasks class implementation
        <ul className="collapsible collapsible33">
          <li className="collapsible-item">
            <div className="collapsible-header"> 1342 </div>
            <div className="collapsible-body">11111111111</div>
          </li>
          <li className="collapsible-item">
            <div className="collapsible-header"> 220 </div>
            <div className="collapsible-body">2222222222222</div>
          </li>
          <li className="collapsible-item">
            <div className="collapsible-header"> 3972</div>
            <div className="collapsible-body">3333333333333</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default StaffList_class;
