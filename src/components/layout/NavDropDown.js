import React from "react";
import { Dropdown } from "react-materialize";
import { NavLink } from "react-router-dom";

const NavDropDown = ({ id, signOut, btnStyle, isSuper, profile }) => {
  var navlinks = (
    <>
      <NavLink className="dropdown_header grey darken-3" to="#">
        <span> {profile.initials} </span>
        <span> {profile.role} </span>
      </NavLink>
      {isSuper ? (
        <>
          <NavLink to="/createorder">New Order</NavLink>
          <NavLink to="/importorders">Import</NavLink>
          <NavLink to="/timereport">Time Report</NavLink>
          <NavLink to="/users">Edit User</NavLink>
        </>
      ) : (
        ""
      )}

      <NavLink to="/" onClick={signOut}>
        Sign Out
      </NavLink>
    </>
  );

  return (
    <Dropdown
      id={id}
      className="nav_dropdown"
      trigger={
        <a className={"nav_dropdown_btn " + btnStyle}>
          <i className="material-icons">dehaze</i>
        </a>
      }
    >
      {navlinks}
    </Dropdown>
  );
};

export default NavDropDown;
