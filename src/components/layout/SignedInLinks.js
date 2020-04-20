import React from "react";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import NavRightBtns from "./NavRightBtns";
import NavDropDown from "./NavDropDown";
import { isSuper } from "../utilityFunc/functions";

const SignedInLinks = ({ profile, signOut }) => {
  return (
    <>
      <div className="signedinlinks">
        {/* 
        
          MOBILE VIEW
        
        */}
        <ul className="right hide-on-large-only">
          <li className="nav_btn mobile">
            <NavDropDown
              id={"mobile_view"}
              signOut={signOut}
              btnStyle={"transparent"}
              isSuper={isSuper(profile)}
              profile={profile}
            />
          </li>
        </ul>

        {/* 
        
          PC VIEW
        
        */}
        <ul className="right hide-on-med-and-down">
          <NavRightBtns profile={profile} isSuper={isSuper} signOut={signOut} />
          {/* 
          <!-- Dropdown Structure --> 
          */}

          <li className="nav_btn pc">
            <NavDropDown
              id={"pc_view"}
              signOut={signOut}
              btnStyle={" "}
              isSuper={isSuper(profile)}
              profile={profile}
            />
          </li>

          {/* end dropdown */}
        </ul>
        {/* END: ul.right */}
      </div>
      {/* END: div.signedinlinks */}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(null, mapDispatchToProps)(SignedInLinks);
