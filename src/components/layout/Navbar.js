import React from "react";
import { Link, withRouter } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from "react-redux";
import NavTabs from "./NavTabs";

const Navbar = (props) => {
  const { auth, profile, updateTab, showTab } = props;

  const links = auth.uid ? (
    <SignedInLinks profile={profile} auth={auth} />
  ) : (
    <SignedOutLinks />
  );

  return (
    <div className="navbar-fixed">
      <nav className="nav-wrapper grey darken-3">
        <div className="container">
          <Link to="/" className="brand-logo akwa_logo ">
            AKWA
            <span className="version"> v 1.1.0 </span>
          </Link>

          <div className="nav-content navtabs_wrapper center brand-logo">
            <NavTabs
              updateTab={updateTab}
              profile={profile}
              showTab={showTab}
            />
          </div>

          {links}
        </div>
      </nav>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

/**
 * "Navbar" component didn't have access to to react-router, (see App.js)
 * so use "withRouter" to access react-router, so we know the current URL
 * REF: https://stackoverflow.com/a/46735682/5844090
 */
export default withRouter(connect(mapStateToProps)(Navbar));
