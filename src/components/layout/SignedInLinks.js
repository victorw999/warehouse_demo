import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

const buttonStyle = {
  background: "none",
  border: "none",
  color: "white"
};

const SignedInLinks = props => {
  return (
    <div>
      <ul className="right">
        {/* <!-- Dropdown Trigger --> */}
        <a className="dropdown-trigger btn" href="#!" data-target="dropdown1">
          Drop Me!
        </a>

        {/* <!-- Dropdown Structure --> */}
        <ul id="dropdown1" className="dropdown-content">
          <li>
            <a href="#!">one</a>
          </li>
          <li>
            <a href="#!">two</a>
          </li>
          <li className="divider" tabIndex="-1" />
          <li>
            <a href="#!">three</a>
          </li>
          <li>
            <a href="#!">
              <i className="material-icons">view_module</i>four
            </a>
          </li>
          <li>
            <a href="#!">
              <i className="material-icons">cloud</i>five
            </a>
          </li>
        </ul>
        {/* end dropdown */}

        <li>
          <NavLink to="/create">New Project</NavLink>
        </li>
        <li>
          <NavLink to="/createorder">New Order</NavLink>
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

export default connect(
  null,
  mapDispatchToProps
)(SignedInLinks);
