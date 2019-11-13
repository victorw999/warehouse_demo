import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Dropdown, Button, Divider, Icon } from "react-materialize";

const buttonStyle = {
  background: "none",
  border: "none",
  color: "white"
};

const SignedInLinks = props => {
  return (
    <div>
      <ul className="right">
        {/* <!-- Dropdown Structure --> */}

        <li>
          <Dropdown
            className="nav_dropdown"
            trigger={
              <Button
                floating
                className="nav_dropdown_btn"
                waves="light"
                style={{
                  marginRight: "5px"
                }}
              >
                <i className="material-icons"> add </i>
              </Button>
            }
          >
            {/* <a href="/create">New Project</a>
          <a href="/createorder">New Order</a> */}
            <NavLink to="/create">New Project</NavLink>
            <NavLink to="/createorder">New Order</NavLink>
          </Dropdown>
        </li>
        {/* end dropdown */}

        {/* <li>
          <NavLink to="/create">New Project</NavLink>
        </li>
        <li>
          <NavLink to="/createorder">New Order</NavLink>
        </li> */}
        <li>
          <Button
            floating
            className="nav_dropdown_btn"
            waves="light"
            style={{
              marginRight: "5px"
            }}
          >
            <i className="material-icons">insert_chart</i>
          </Button>
        </li>
        <li>
          <button href="#" onClick={props.signOut} style={buttonStyle}>
            Log Out
          </button>
        </li>
        <li>
          <NavLink to="/" className="btn btn-floating pink lighten-1">
            {props.profile.initials}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(null, mapDispatchToProps)(SignedInLinks);
