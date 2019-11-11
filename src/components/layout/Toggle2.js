import React from "react";

const switchStyle = {
  // position: "absolute",
  // left: "30rem"
  padding: "2rem"
};

const Toggle2 = props => {
  return (
    <span className="switch toggleByAuthor" style={switchStyle}>
      <label>
        View by Order
        <input type="checkbox" onChange={props.handleToggle} />
        <span className="lever" />
        View by Styles
      </label>
    </span>
  );
};

export default Toggle2;
