/**
 * @description -
 *   provide tab interface on NavBar, after user selected tab,
 *   notify app.js, dashboard.js to display accordingly
 *
 *   1. react-materialize can't passed down className
 *      hence now use materializecss implementation
 *   2. need access of "onShow" to invoke updateTab()
 */

import { withRouter, NavLink } from "react-router-dom";
import React, { useEffect } from "react";
import M from "materialize-css";
import { isSuper } from "../utilityFunc/functions";

const NavTabs = ({ updateTab, showTab, profile, ...props }) => {
  // init tab
  useEffect(() => {
    var elems = document.querySelectorAll(".tabs.navtabs2");
    var instances = M.Tabs.init(elems, {
      duration: 300,
      onShow: (tabObj) => {
        // "tabObj" is the element currently active
        // invoke updateTab() to change the tab state stored in App.js
        // console.log(tabObj);
        updateTab(tabObj.id);
      },
      responsiveThreshold: Infinity,
      swipeable: false,
    });

    /**
     *   clear "active" class frm all tabs,
     *   and assign "active" based on "showTab"
     */
    var arr = document.querySelectorAll(".topNavTabs");

    for (let i = 0; i < arr.length; i++) {
      let e = arr[i];
      e.classList.remove("active");
    }
    var element = document.getElementById(`${showTab}_tab`);
    if (element) {
      element.classList.add("active");
    }
  }); // useEffect only run once

  return (
    <>
      {/* if current url path isn't on 'dashboard', display 'home' link */}
      {props.location.pathname === "/" ? (
        <ul id="navtabs_id" className="tabs navtabs navtabs2">
          <li className="tab col s3">
            <a id="styles_tab" className="topNavTabs" href="/#styles">
              Styles
            </a>
          </li>
          <li className="tab col s3">
            <a id="orders_tab" className="topNavTabs   " href="/#orders">
              Orders
            </a>
          </li>
          {isSuper(profile) ? (
            <li className="tab col s3">
              <a id="staffs_tab" className="topNavTabs " href="/#staffs">
                Staffs
              </a>
            </li>
          ) : (
            ""
          )}
        </ul>
      ) : (
        <ul className="navtab_home">
          <li className="tab">
            <NavLink
              to="/"
              onClick={() => {
                props.history.push("/");
              }}
            >
              HOME
            </NavLink>
          </li>
        </ul>
      )}

      {/* 
        tab contents 
        Once tab is selected, onShow() callback will send below selected element id to App.js's showTab      
      */}
      <div id="styles" className="col s12 tab_contents"></div>
      <div id="orders" className="col s12 tab_contents"></div>
      <div id="staffs" className="col s12 tab_contents"></div>
    </>
  );
};

export default withRouter(NavTabs);
