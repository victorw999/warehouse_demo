import React from "react";

const NavRightBtns = ({ profile }) => {
  return (
    <>
      <li className="nav_btn user_init">
        <button className="btn" disabled>
          {profile.initials}
        </button>
      </li>
      <li>{profile.role ? profile.role : ""}</li>
    </>
  );
};

export default NavRightBtns;
